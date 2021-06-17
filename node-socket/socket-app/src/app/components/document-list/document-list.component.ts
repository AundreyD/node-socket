import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Observable<string[]>;
  currentDoc: string | undefined;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) { 
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDocument.subscribe(
      (doc: any) => {
        console.log('received', doc);
        this.currentDoc = doc.id
      } )
  }

  ngOnInit(): void {
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }

  newDoc() {
    this.documentService.newDocument();
  }

  ngOnDestroy() {
    this._docSub.unsubscribe()
  }

}
