
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { EditorArticleResolverService } from './editor-article-resolver.service';
import { AuthGuard } from '../core';

const routes: Routes = [
  { path: '', component: EditorComponent, canActivate: [AuthGuard] },
  {
    path: ':slug',
    component: EditorComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {}
