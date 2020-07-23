import { AuthGuard} from './../core/services/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { EditorArticleResolverService } from './editor-article-resolver.service';

const routes: Routes = [
  { path: '', component: EditorComponent },
  {
    path: ':slug',
    component: EditorComponent
  }
];


// const routes: Routes = [
//   { path: '', component: EditorComponent, canActivate: [AuthGuard] },
//   {
//     path: ':slug',
//     component: EditorComponent,
//     canActivate: [AuthGuard],
//     resolve: { article: EditorArticleResolverService }
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {}
