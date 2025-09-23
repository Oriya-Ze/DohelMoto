FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --shell /bin/bash app \
 && chown -R app:app /app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["python", "-c", "import sys,urllib.request; \
try: \
    r=urllib.request.urlopen('http://localhost:8000/health',timeout=5); \
    sys.exit(0 if r.status==200 else 1) \
except Exception: \
    sys.exit(1)"]

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

