import logging
from functools import reduce, wraps

import jwt
from flask import Flask, abort, g, jsonify, redirect, request, url_for
from flask_cors import CORS
from optimizely import optimizely

import requests

logger = logging.getLogger("app")

JWT_SECRET = "optimizely"


def auth(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
        token = request.headers.get("authorization", None)
        if token is None:
            abort(401)

        try:
            g.user = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # force convert age json string to integer
            g.user["age"] = int(g.user["age"])
        except jwt.InvalidTokenError as err:
            logger.error(err)
            abort(403)
        return fn(*args, **kwargs)

    return decorator


application = Flask(__name__)
CORS(application)

optimizely_client = optimizely.Optimizely(
    sdk_key="DPzcaJRvhpcagqKUHdM1z", logger=logger
)


@application.route("/")
def index():
    return redirect(url_for("health"))


@application.route("/health")
def health():
    status = dict(http=True, optimizely=True, ads=True)

    opt_config = optimizely_client.get_optimizely_config()
    if opt_config is None:
        status["optimizely"] = False

    ads = requests.get("http://ads:5000/health")
    if ads.status_code != 200:
        status["ads"] = False

    return (
        jsonify(status),
        200 if reduce(lambda v, acc: acc & v, status.values(), True) else 500,
    )


@application.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    country = request.json.get("country", None)
    age = request.json.get("age", None)

    if email is None or country is None or age is None:
        abort(422)

    token = jwt.encode(
        {"email": email, "country": country, "age": age},
        JWT_SECRET,
        algorithm="HS256",
    )

    return jsonify(token=token)


@application.route("/feature", methods=["GET"])
@auth
def feature():
    is_enabled = optimizely_client.is_feature_enabled("ads", g.user["email"], g.user)

    if not is_enabled:
        abort(404)

    items = optimizely_client.get_feature_variable(
        "ads", "items", g.user["email"], g.user
    )

    goods_request = requests.get(f"http://ads:5000/goods?type={items}")

    if goods_request.status_code != 200:
        abort(goods_request.status_code)

    return jsonify(items=items, goods=goods_request.json())


application.run(debug=True, host="0.0.0.0")
