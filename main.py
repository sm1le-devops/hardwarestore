from fastapi import FastAPI, APIRouter, Request, Form, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os, smtplib
from dotenv import load_dotenv

# --- Загрузка .env ---
load_dotenv()

# --- FastAPI ---
app = FastAPI()
router = APIRouter()

# --- Статика ---
app.mount("/static", StaticFiles(directory="static"), name="static")
ads = [
    # ===== Внутренние работы =====
    {
        "id": 1,
        "title": "Электрика",
        "category": "electrical",
        "icon": "fa-lightbulb",
        "description": "Все виды электрических работ внутри помещений.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 2,
        "title": "Сантехника",
        "category": "plumbing",
        "icon": "fa-faucet",
        "description": "Монтаж и ремонт сантехники.",
        "image": "/static/assets/byt1.jpg"
    },
    {
        "id": 3,
        "title": "Малярные работы",
        "category": "painting",
        "icon": "fa-paint-roller",
        "description": "Покраска стен, потолков и фасадов.",
        "image": "/static/assets/byt.jpg"
    },
    {
        "id": 4,
        "title": "Плиточные работы",
        "category": "tiling",
        "icon": "fa-border-all",
        "description": "Укладка плитки любой сложности.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 5,
        "title": "Демонтажные работы",
        "category": "rodof",
        "icon": "fa-trash-can",
        "description": "Демонтаж старых конструкций и ремонтных элементов.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 6,
        "title": "Гипсокартонные конструкции",
        "category": "rosof",
        "icon": "fa-building-columns",
        "description": "Монтаж перегородок, потолков и декоративных конструкций из ГКЛ.",
        "image": "/static/assets/restoration.jpg"
    },

    # ===== Внешние работы =====
    {
        "id": 7,
        "title": "Фасадные работы",
        "category": "facade",
        "icon": "fa-house-chimney",
        "description": "Отделка фасадов и наружные работы.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 8,
        "title": "Кровельные работы",
        "category": "roof",
        "icon": "fa-hammer",
        "description": "Монтаж и ремонт крыш любого типа.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 9,
        "title": "Реставрационные работы",
        "category": "rood",
        "icon": "fa-person-digging",
        "description": "Восстановление старых конструкций и ремонт.",
        "image": "/static/assets/restoration.jpg"
    },
    {
        "id": 10,
        "title": "Отделка фасадов",
        "category": "facade-finishing",
        "icon": "fa-paintbrush",
        "description": "Финишная отделка фасадов зданий.",
        "image": "/static/assets/restoration.jpg"
    }
]

# --- Шаблоны ---
templates = Jinja2Templates(directory="templates")


# --- Главная страница ---
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# --- Страница услуг ---
@router.get("/attendance", response_class=HTMLResponse)
async def get_services(request: Request):
    return templates.TemplateResponse("attendance.html", {"request": request, "ads": ads})


# --- Страница анкеты ---
@router.get("/anket", response_class=HTMLResponse)
async def get_anket(request: Request):
    return templates.TemplateResponse("anket.html", {"request": request})

# --- Страница обьявления ---
@router.get("/ad/{ad_id}", response_class=HTMLResponse)
async def get_ad(ad_id: int, request: Request):
    ad = next((item for item in ads if item["id"] == ad_id), None)
    if not ad:
        return HTMLResponse("<h1>Объявление не найдено</h1>", status_code=404)
    return templates.TemplateResponse("ad.html", {"request": request, "ad": ad})

# --- Отправка формы ---
@router.post("/anket", response_class=HTMLResponse)
async def post_anket(
    request: Request,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    description: str = Form(...),
    photo: UploadFile | None = File(None)
):
    sender_email = os.getenv("MAIL_USER")
    password = os.getenv("MAIL_PASSWORD")
    receiver_email = os.getenv("MAIL_RECEIVER", sender_email)

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = f"Новая заявка от {name}"

    body = f"""
Имя: {name}
Телефон: {phone}
Email: {email}
Описание: {description}
"""
    msg.attach(MIMEText(body, "plain"))

    # --- если есть фото ---
    if photo and photo.filename:
        content = await photo.read()
        part = MIMEBase("application", "octet-stream")
        part.set_payload(content)
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename={photo.filename}")
        msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка отправки письма: {e}")

    # ✅ уведомление и редирект
    return HTMLResponse("""
        <script>
            alert("✅ Заявка успешно отправлена!");
            window.location.href = "/";
        </script>
    """)


# --- Подключаем роутер ---
app.include_router(router)
