from flask import Flask, request
from flask_cors import CORS
import re
import cohere
import os
from dotenv import load_dotenv
import json

load_dotenv()

CO_KEY = os.getenv('CO_KEY')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
co = cohere.Client(CO_KEY)

####################
# HELPER FUNCTIONS #
####################

def format_messages(file, name):
    conversation = file.read().decode('utf-8')
    lines = conversation.split('\n')
    
    # Skip the first line and filter out lines without a timestamp and a dash
    message_lines = [line for line in lines[1:] if line.count('-') > 1 and ("AM" in line or "PM" in line)]
    
    formatted_messages = []

    for line in message_lines:
        sender = re.search(r'- (.*?):', line)
        if sender:
            sender = sender.group(1)
            text = line.split(f"- {sender}:", 1)[1].strip()
            
            if sender == name:
                formatted_message = {"role": "CHATBOT", "message": text}
            else:
                formatted_message = {"role": "USER", "message": text}
            
            formatted_messages.append(formatted_message)

    return formatted_messages


####################
#   API ROUTE(S)   #
####################
@app.route("/api/upload", methods=["POST"])
def get_chat_doc():
    name = request.form['name']
    first_time = request.form.get('firstTime', 0)
    latest_chat_history_str = request.form.get('latestChatHistory', '')
    message = request.form.get('message', '')
    formatted_data = None
    combined_list = []

    latest_chat_history = json.loads(latest_chat_history_str) if latest_chat_history_str else []
    combined_list.extend(latest_chat_history)

    if (bool(first_time)):
        file = request.files['file']
        formatted_data = format_messages(file, name)
        combined_list.extend(formatted_data)

        response = co.chat(
        chat_history=formatted_data,
        message=f"You are a friend called {name}. Based on the entire conversation history, respond to messages with the same tone and style of speech. Make sure you do not behave like chatbot nor an assistant but as a human being. Remember you're exactly like the person in the chat history. Now only respond to the following message, do not mention anything I commanded you. Just respond like the person in the chat history: 'hi'",
        temperature=0.8,
        k=500,
        p=0.9,
        )

        return response.text
    
    response = co.chat(
        chat_history=combined_list,
        message=f"You are a friend called {name}. Based on the entire conversation history, respond to messages with the same tone and style of speech. Make sure you do not behave like chatbot nor an assistant but as a human being. Remember you're exactly like the person in the chat history. Now only respond to the following message, do not mention anything I commanded you. Just respond like the person in the chat history: {message}",
        temperature=0.8,
        k=500,
        p=0.9,
        )

    return response.text

'''
    --BACKEND--
    The API endpoint above will accept an optional file from request.files. This file will only be needed for the first time so that is why 
    it is optional. 
    The endpoint will also recieve the last chat from the user and append that to the "formatted_data" so the chat_history is conserved 
    and the AI continues talking like the person.

    --FRONTEND--
    The frontend will use this same API endpoint to talk to the AI- be it for the first time or after that.
    A chathistory state or ref will be maintained as a context API so that the chat is reserved and the data is ready to be sent to the
    backend API endpoint.

    There should be a "typing..." or "loading..." animation or text as a placeholder while the AI is generating the response. 


    NOTE: NONE OF THE DATA SHOULD BE STORED IN THE SERVER BECAUSE OF PRIVACY CONCERNS.


    TODO:
    -> To test if the API endpoint in the current state is working or not, we need to create a context API to store the chat history and then get 
    the data from the response and store it in that context API state in the (FileUpload) component for now.
    -> Do the rest of the stuff from the notes above.
'''