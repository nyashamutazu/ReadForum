import { ProfileListConfig } from './../models/profile-list-config.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile } from '../models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  constructor(private apiService: ApiService) {}

  query(config: ProfileListConfig): Observable<any> {
    const params = {};

    Object.keys(config.filters).forEach(k => {
      params[k] = config.filters[k];
    });
    console.log(params);

    return this.apiService.get(
      `/profiles/${config.type}`,
      new HttpParams({ fromObject: params })
    );
  }

  get(username: string): Observable<{ message: string; profile: Profile }> {
    return this.apiService.get(`/profiles/${username}`);
  }

  follow(username: string): Observable<any> {
    return this.apiService.post(`/profiles/${username}/follow`);
  }

  unfollow(username: string): Observable<any> {
    return this.apiService.delete(`/profiles/${username}/follow`);
  }
}
