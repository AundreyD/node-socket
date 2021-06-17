from typing import IO
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from werkzeug import debug
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, logger=True, engineio_logger=True, cors_allowed_origins='http://localhost:4200')
prev = None
documents = {}

def sendDocs():
    emit('documents', list(documents.keys()))
    
def newSession(docId):
    global prev
    if prev is not None:
        leave_room(prev)

    join_room(docId)
    prev = docId

@socketio.on('connect')
def connected():
    if len(documents) is 0:
       return  emit(documents, {})
    sendDocs()
    print('connected')
    
@socketio.on('getDoc')
def getDoc(docId):
    newSession(docId)
    emit('document', documents[docId])
    sendDocs()

@socketio.on('addDoc')
def addDoc(doc):
    documents[doc['id']] = doc
    newSession(doc['id'])
    emit('document', doc)
    sendDocs()

@socketio.on('editDoc')
def getDoc(doc):
    documents[doc['id']] = doc
    emit('document',doc,  to=doc[id])
    sendDocs()



if __name__ == '__main__':
    socketio.run(app, port=4444, host='0.0.0.0', debug=True)