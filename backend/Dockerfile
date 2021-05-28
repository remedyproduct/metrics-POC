FROM python:3.9-alpine
RUN pip install pipenv
WORKDIR /application

COPY Pipfile Pipfile.lock ./
RUN pipenv install --deploy
COPY ./ ./

EXPOSE 5000

CMD ["pipenv", "run", "python", "application.py"]
