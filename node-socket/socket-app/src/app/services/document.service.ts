import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { fromEvent } from 'rxjs';
import { Document } from 'src/app/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getDoc', id)
  }

  newDocument() {
    this.socket.emit('addDoc', {id: this.docId(), doc: ''})
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  private docId() {
    return Math.floor(Math.random() * 111)
  }
}
