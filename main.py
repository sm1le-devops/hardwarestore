from fastapi import FastAPI, APIRouter, Request, Form, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from email.mime.text import MIMEText
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os, smtplib
from dotenv import load_dotenv
import json
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Depends
from starlette.requests import Request
import secrets
from starlette.middleware.sessions import SessionMiddleware
from typing import List
# --- Загрузка .env ---
load_dotenv()

# --- FastAPI ---
class SecurityHeaders(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' https://cdnjs.cloudflare.com;"
    "font-src 'self' https://cdnjs.cloudflare.com data:; "
    "img-src 'self' data:; "
    "object-src 'none'; "
    "base-uri 'self'; "
    "frame-ancestors 'none'; "
    "connect-src 'self';"
)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response
    
app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SecurityHeaders)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"),https_only=True,)
router = APIRouter()
# --- Статика ---
app.mount("/static", StaticFiles(directory="static"), name="static")

with open("static/lang/ru.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    ads = data.get("servicesList", [])
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

# --- CSRF защита  ---

def generate_csrf_token(request: Request):
    if "_csrf_token" not in request.session:
        request.session["_csrf_token"] = secrets.token_hex(16)
    return request.session["_csrf_token"]

# --- Страница анкеты ---
@router.get("/anket", response_class=HTMLResponse)
async def get_anket(request: Request):
    token = request.session.get("_csrf_token") or secrets.token_hex(16)
    request.session["_csrf_token"] = token
    response = templates.TemplateResponse("anket.html", {"request": request, "csrf_token": token})
    # Устанавливаем CSRF токен в куку безопасно
    response.set_cookie(
        "csrf_token",
        token,
        httponly=True,
        secure=True,   # Только HTTPS
        samesite="lax"
    )
    return response

# --- Страница обьявления ---
@router.get("/ad/{ad_id}", response_class=HTMLResponse)
async def get_ad(ad_id: int, request: Request):
    ad = next((item for item in ads if item["id"] == ad_id), None)
    if not ad:
        return HTMLResponse("<h1>Объявление не найдено</h1>", status_code=404)
    return templates.TemplateResponse("ad.html", {"request": request, "ad": ad})

# --- Отправка формы ---
@router.post("/anket", response_class=HTMLResponse)
@limiter.limit("2/minute")
async def post_anket(
    request: Request,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    description: str = Form(...),
    photo: List[UploadFile] = File(default=[]),
    csrf_token: str = Form(...)
):
    # Проверка CSRF
    session_token = request.session.get("_csrf_token")
    if not session_token or session_token != csrf_token:
        raise HTTPException(status_code=403, detail="CSRF token invalid")

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

    # --- обработка всех фото ---
    if photo:
        for file in photo:
            if file.filename:
                content = await file.read()
                if len(content) > 3 * 1024 * 1024:  # 3MB на файл
                    raise HTTPException(400, f"Файл {file.filename} слишком большой")
                part = MIMEBase("application", "octet-stream")
                part.set_payload(content)
                encoders.encode_base64(part)
                part.add_header("Content-Disposition", f"attachment; filename={file.filename}")
                msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка отправки письма: {e}")

    return RedirectResponse("/", status_code=303)


# --- Подключаем роутер ---
app.include_router(router)
