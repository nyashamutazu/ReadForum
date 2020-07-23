import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private apiService: ApiService) { }

  getAll(): Observable<any> {
    return this.apiService.get('/tags').pipe(map(data => data.tags.slice(0, 10)));
  }
}
