import { EditorIconService } from './editor/services/editor-icon.service';
import { EditorHtmlParserService } from './editor/services/editor-html-parser.service';
import { AuthGuard } from './services/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpTokenInterceptor } from './interceptors';

import {
  TagsService,
  UserService,
  ProfilesService,
  JwtService,
  CommentsService,
  ArticlesService,
  ApiService
} from './services';
import { EditorControllerService, EditorLegacyBrowserService, EditorParserService } from './editor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    ArticlesService,
    AuthGuard,
    CommentsService,
    JwtService,
    ProfilesService,
    TagsService,
    UserService,
    EditorControllerService,
    EditorHtmlParserService,
    EditorIconService,
    EditorLegacyBrowserService,
    EditorParserService,
  ]
})
export class CoreModule {}
