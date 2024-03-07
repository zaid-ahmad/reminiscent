from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route("/api/upload", methods=["POST"])
def get_chat_doc():
    chat = request.json

    print(chat)
    return "<p>Hello, World!</p>"

@app.route("/")
def test():
    print('hi')
    return "<p>Hello, World!</p>"