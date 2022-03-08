"""
Bee doesn't allow external users to post to it.
So this module serves as a proxy between the node and
Bee so that a web app can upload files to a node
"""
from flask import Flask, request
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json
import os
import subprocess

UPLOAD_FOLDER = '/home/daniel/flask_bee_proxy/files'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg'}

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class SwarmResult:
    def __init__(self, result):
        self.data = result.decode('utf-8')
        self.split_data = self.data.split('\n')

    def get_hash(self):
        return self.split_data[0].split(' ')[-1]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_to_swarm(filename):
    fp = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        raw_result = subprocess.check_output(["swarm-cli", "upload", fp, "--stamp", "9c24594f0669b8c96a89bbc55f2b90241dbd904771030987d43a046a3616f9c4"])
        result = SwarmResult(raw_result)
        return json.dumps({"hash": result.get_hash()})
    except subprocess.CalledProcessError:
        return json.dumps({"error": "Problem occurred while uploading file to swarm"})

@app.route("/", methods = ['POST'])
@cross_origin()
def helloWorld():
    if 'file' not in request.files:
        return json.dumps({"error": "No file uploaded"})
    else:
        uploaded_file = request.files['file']
        if uploaded_file.filename == '':
            return json.dumps({"error": "No file uploaded"})
        if allowed_file(uploaded_file.filename):
            filename = secure_filename(uploaded_file.filename)
            uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return upload_to_swarm(filename)
        else:
            return json.dumps({"error": "File is not an image"})
    return json.dumps({"error": "Unexpected result"})