FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

# ... rest of your file (CMD, etc) ...
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]