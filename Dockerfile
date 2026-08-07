FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD python -m uvicorn api.index:app --host 0.0.0.0 --port ${PORT:-8000}
