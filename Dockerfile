# --- 1. БАЗОВЫЙ ОБРАЗ ---
FROM python:3.11-slim

# --- 2. Рабочая директория ---
WORKDIR /app

# --- 3. Установка зависимостей ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- 4. Копируем проект ---
COPY . .

# --- 5. Открываем порт ---
EXPOSE 8000

# --- 6. Команда запуска (Uvicorn) ---
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
