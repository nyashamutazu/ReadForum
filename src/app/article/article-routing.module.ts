import { ArticleResolverService } from './article-resolver.service';
import { ArticleComponent } from './article.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':slug',
    component: ArticleComponent,
  }
];

// const routes: Routes = [
//   {
//     path: ':slug',
//     component: ArticleComponent,
//     resolve: {
//       article: ArticleResolverService
//     }
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
