import { HttpParams } from '@angular/common/http';
import { Article } from './../models/article.model';
import { ArticleListConfig } from './../models/article-list-config.model';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private apiService: ApiService) {}

  private articles: Article[] = [];
  private articlesUpdated = new Subject<{
    articles: Article[];
    articleCount: number;
  }>();

  query(
    config: ArticleListConfig
  ): Observable<any> {

    const params = {};

    Object.keys(config.filters).forEach(k => {
      params[k] = config.filters[k];
    });

    const type = `${config.type}`;

    return this.apiService.get(`/articles/${type}`, new HttpParams({ fromObject: params }));
  }

  get(slug): Observable<any> {
    return this.apiService
      .get(`/articles/${slug}`)
      .pipe(map(data => data.article ));
  }

  save(article: Article, creating: boolean): Observable<Article> {

    if (typeof creating === 'undefined' || creating === null) {
      console.log('Updating');
      return this.apiService.put(`/articles/${article.slug}`, {article}).pipe(map(data => data.article));
    } else {
      console.log('Creating');

      return this.apiService.post(`/articles`, {article}).pipe(map(data => data.article));
    }
  }

  delete(slug) {
    return this.apiService.delete(`/articles/${slug}`);
  }

  like(slug): Observable<Article> {
    return this.apiService.post(`/articles/${slug}/liked`);
  }

  unlike(slug): Observable<Article> {
    return this.apiService.delete(`/articles/${slug}/liked`);
  }

  getArticledUpdatedListener() {
    return this.articlesUpdated.asObservable();
  }
}
