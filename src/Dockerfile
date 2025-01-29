FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev curl net-tools netcat-openbsd gettext postgresql-client openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY app/requirements.txt .
COPY app/entrypoint.sh .

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x entrypoint.sh

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

ENTRYPOINT ["/app/entrypoint.sh"]
