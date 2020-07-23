import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(private apiService: ApiService) { }

  get(username: string): Observable<{message: string, profile: Profile}> {
    return this.apiService.get(`/profiles/${username}`);
  }

  follow(username: string): Observable<any> {
    return this.apiService.post(`/profiles/${username}/follow`);
  }

  unfollow(username: string): Observable<any> {
    return this.apiService.delete(`/profiles/${username}/follow`);
  }
}
