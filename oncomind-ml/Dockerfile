FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# SADECE dependency bilgisi
COPY requirements.lock .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.lock

# ❌ KOD COPY ETME
# Kod volume ile gelecek

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
