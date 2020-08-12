import { Injectable } from '@angular/core';
import { EditorHtmlParserService } from './editor-html-parser.service';
import { EditorParser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EditorParserService extends EditorHtmlParserService implements EditorParser {}
