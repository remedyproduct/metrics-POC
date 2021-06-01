FROM python:3.9
RUN pip install pipenv
WORKDIR /application

COPY Pipfile Pipfile.lock ./
RUN pipenv install --deploy --system
COPY ./ ./

EXPOSE 5000

CMD ["python", "application.py"]
