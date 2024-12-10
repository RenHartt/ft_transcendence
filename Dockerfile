FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev curl net-tools && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080
COPY app/entrypoint.sh .
RUN chmod +x entrypoint.sh
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

ENTRYPOINT ["/app/entrypoint.sh"]