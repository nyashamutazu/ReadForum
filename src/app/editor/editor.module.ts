import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorArticleResolverService } from './editor-article-resolver.service';

@NgModule({
  declarations: [EditorComponent],
  imports: [SharedModule, EditorRoutingModule],
  providers: [EditorArticleResolverService]
})
export class EditorModule {}
