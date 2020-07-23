import { ArticleCommentComponent } from './article-comment/article-comment.component';
import { ArticleComponent } from './article.component';
import { ArticleRoutingModule } from './article-routing.module';
import { NgModule } from '@angular/core';
import { ArticlePipe } from './article.pipe';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../core';

@NgModule({
  declarations: [ArticleComponent, ArticleCommentComponent],
  imports: [SharedModule, ArticleRoutingModule],
  // providers: [AuthGuard]
})
export class ArticleModule {}
