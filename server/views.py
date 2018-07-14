from run import app
from flask import jsonify

@app.route('/', methods=['GET', 'POST'])
def index():
    print('test')
    return jsonify({'message': 'Hello, World!'})