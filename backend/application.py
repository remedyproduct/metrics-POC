from functools import reduce, wraps

import jwt
from flask import Flask, abort, g, jsonify, redirect, request, url_for
from optimizely import optimizely

JWT_SECRET = "secret"


def auth(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
        token = request.headers.get("authorization", None)
        if token is None:
            abort(404)

        try:
            g.user = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            abort(404)
        return fn(*args, **kwargs)

    return decorator


application = Flask(__name__)
optimizely_client = optimizely.Optimizely(sdk_key="DPzcaJRvhpcagqKUHdM1z")


@application.route("/")
def index():
    return redirect(url_for("health"))


@application.route("/health")
def health():
    status = dict(http=True, optimizely=True)

    opt_config = optimizely_client.get_optimizely_config()
    if opt_config is None:
        status["optimizely"] = False

    return (
        jsonify(status),
        200 if reduce(lambda v, acc: acc & v, status.values(), True) else 500,
    )


@application.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    location = request.json.get("location", None)
    age = request.json.get("age", None)

    if email is None or location is None or age is None:
        abort(404)

    token = jwt.encode(
        {"email": email, "location": location, "age": age},
        JWT_SECRET,
        algorithm="HS256",
    )

    return jsonify(token=token)


@application.route("/feature", methods=["GET"])
@auth
def feature():
    is_enabled = optimizely_client.is_feature_enabled(
        "recommendations", g.user["email"], g.user
    )

    if not is_enabled:
        abort(404)

    items = optimizely_client.get_feature_variable(
        "recommendations", "items", g.user["email"], g.user
    )

    return jsonify(items=items)


application.run(debug=True, host="0.0.0.0")
