from flask import Flask, request
from flask_cors import CORS
import cohere, os, json, re
from dotenv import load_dotenv

load_dotenv()

CO_KEY = os.getenv('CO_KEY')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
co = cohere.Client(CO_KEY)

def format_messages(file_content, name):
    messages = []
    lines = file_content.split('\n')
    for line in lines:
        if f" - {name}:" in line:
            message = line.split(f" - {name}: ")[1].strip()
            messages.append({"role": "USER", "message": message})
        else:
            message_parts = line.split(" - ")
            if len(message_parts) > 1:
                speaker = re.sub(r'^.*?-\s[A-Za-z]+:\s', '', line)
                message = message_parts[-1].strip()
                messages.append({"role": "CHATBOT" if speaker == name else "USER", "message": message})

    return messages

@app.route("/api/upload", methods=["POST"])
def get_chat_doc():
    name = request.form['name']
    first_time = request.form.get('firstTime', 0)
    latest_chat_history_str = request.form.get('latestChatHistory', '')
    message = request.form.get('message', '')

    latest_chat_history = json.loads(latest_chat_history_str) if latest_chat_history_str else []

    if (bool(first_time)):
        file = request.files['file'].read().decode('utf-8')
        formatted_data = format_messages(file, name)

        response = co.chat(
        chat_history=formatted_data,
        message=f"You are a friend called {name}. Based on the conversation history provided, respond to messages with the same tone and style of speech. Talk like people talk on WhatsApp and text messages. Make sure you do not behave like chatbot nor an assistant but as a human being. Remember you're exactly like the person in the chat history. Now only respond to the following message, do not mention anything I commanded you. Just respond to this messsage, 'hi', like the chatbot in the chat history.",
        temperature=0.8,
        k=500,
        p=0.9,
        prompt_truncation='AUTO'
        )

        return {"message": response.text, "data": formatted_data}
    
    response = co.chat(
        chat_history=latest_chat_history,
        message=f"You are a friend called {name}. Based on the conversation history provided, respond to messages with the same tone and style of speech. Talk like people talk on WhatsApp and text messages. Make sure you do not behave like chatbot nor an assistant but as a human being. Remember you're exactly like the person in the chat history. Now only respond to the following message, do not mention anything I commanded you. Just respond like the person in the chat history: {message}",
        temperature=0.8,
        k=500,
        p=0.9,
        prompt_truncation='AUTO'
        )

    return response.text