FROM python:3.9-slim
RUN pip install pipenv
WORKDIR /application

RUN apt-get update && apt-get install -y --no-install-recommends g++ && rm -rf /var/lib/apt/lists/*

COPY Pipfile Pipfile.lock ./
RUN pipenv install --deploy --system
COPY ./ ./

EXPOSE 5000

# ENTRYPOINT []
CMD ["newrelic-admin", "run-program", "python", "application.py"]
