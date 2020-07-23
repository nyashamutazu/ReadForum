import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private apiService: ApiService) { }

  add(slug, body): Observable<{message: string, data: any }> {

    return this.apiService.post(`/articles/${slug}/comments`, {body}).pipe(map(response => response));
  }

  getAll(slug): Observable<Comment[]>  {
    return this.apiService.get(`/articles/${slug}/comments`).pipe(map(data => data.comments));
  }

  destroy(id, slug): Observable<any> {
    return this.apiService.delete(`/articles/${slug}/comments/${id}`);
  }
}
