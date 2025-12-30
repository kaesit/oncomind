FROM python:3.11-slim

WORKDIR /app

# 1. Install System Dependencies (Cached Layer)
# Added libxrender1 (for RDKit) and others just in case
RUN apt-get update && apt-get install -y \
    libxrender1 \
    libxext6 \
    libsm6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Python Dependencies (Cached Layer)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

<<<<<<< HEAD
# 3. Copy Application Code (Changes Frequently)
COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
=======

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
>>>>>>> 903f78c (Mac desktop: docker and ml local adjustments)
