from flask import Flask, redirect, url_for

application = Flask(__name__)

@application.route('/')
def index():
  return redirect(url_for("home"))

@application.route('/home')
def home():
  return "Welcome!"

@application.route('/feature')
def feature():
  return "Awesome THING!"

application.run(host='0.0.0.0')
