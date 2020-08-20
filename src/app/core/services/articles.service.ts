import { HttpParams, HttpClient } from '@angular/common/http';
import { Article } from './../models/article.model';
import { ArticleListConfig } from './../models/article-list-config.model';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  private articles: Article[] = [];
  private articlesUpdated = new Subject<{
    articles: Article[];
    articleCount: number;
  }>();

  query(config: ArticleListConfig): Observable<any> {
    const params = {};

    Object.keys(config.filters).forEach(k => {
      params[k] = config.filters[k];
    });

    const type = `${config.type}`;

    return this.apiService.get(
      `/articles/${type}`,
      new HttpParams({ fromObject: params })
    );
  }

  get(slug): Observable<any> {
    return this.apiService
      .get(`/articles/${slug}`)
      .pipe(map(data => data.article));
  }

  save(article: any, creating: boolean): Observable<Article> {
    if (!creating) {
      return this.apiService
        .put(`/articles/${article.slug}`, { article })
        .pipe(map(data => data.article));
    } else {
      const data = new FormData();
      data.append('title', article.title);
      data.append('description', article.description);
      data.append('imageFile', article.imageFile);
      data.append('body', article.body);
      // tslint:disable-next-line:forin
      for (const i in article.tagList) {
        data.append(`tag[${i}]`, article.tagList[i]);
      }

      return this.http
        .post<{ message: string; article: Article }>(
          `${environment.api_url}/articles`,
          data
        )
        .pipe(map(response => response.article));
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
