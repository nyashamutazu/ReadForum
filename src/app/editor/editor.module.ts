import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorArticleResolverService } from './editor-article-resolver.service';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { EditorDropdownComponent } from './editor-dropdown/editor-dropdown.component';
import { EditorViewComponent } from './editor-view/editor-view.component';
import { EditorInputComponent } from './editor-input/editor-input.component';

@NgModule({
  declarations: [EditorComponent, TextEditorComponent, EditorDropdownComponent, EditorViewComponent, EditorInputComponent],
  imports: [SharedModule, EditorRoutingModule],
  providers: [EditorArticleResolverService]
})
export class EditorModule {}
