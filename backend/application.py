from flask import Flask, redirect, url_for
from optimizely import optimizely

application = Flask(__name__)
optimizely_client = optimizely.Optimizely(
    sdk_key='DPzcaJRvhpcagqKUHdM1z'
)

@application.route('/')
def index():
  return redirect(url_for("health"))

@application.route('/health')
def health():
  if optimizely_client.is_valid:
    return 'Optimizely client is initialized.'
  else:
    return 'Error optimizely client initialization.'

@application.route('/feature')
def feature():
  is_enabled = optimizely_client.is_feature_enabled('Experiment', '1237')

  if is_enabled:
      enable = optimizely_client.get_feature_variable('Experiment', 'AWESOME', '1237')

      if enable:
        return "Awesome FEATURE!"

  return "FEATURE!"

application.run(debug=True, host='0.0.0.0')
