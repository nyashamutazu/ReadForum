import { JwtService } from './jwt.service';
import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<User>({} as User);
  public currentUserListner = this.currentUser
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticated = new ReplaySubject<boolean>(1);
  public isAuthenticatedListner = this.isAuthenticated.asObservable();

  private tokenTimer: any;

  constructor(private apiService: ApiService, private jwtService: JwtService, private router: Router) {}

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUser(): Observable<any> {
    return this.apiService.get(`/user`);
  }

  autoAuth() {
    const auth = this.jwtService.getToken();

    if (typeof auth === 'undefined' || auth === null) {
      this.purgeAuth();
      return;
    }

    const now = new Date();
    const inFuture = auth.expirationDate.getTime() - now.getTime();

    if (inFuture > 0) {
      this.getUser().subscribe(
        response => {
          this.setAuth(response.data.user, response.data.expiresIn);
          this.setTimer(inFuture / 1000);
          return;
        },
        err => this.purgeAuth());
    } else {
      this.purgeAuth();
    }
  }

  attemptAuth(authType: string, credentials: any): Observable<User> {
    const authParam = authType === 'sign-up' ? '' : '/sign-in';

    return this.apiService.post('/user' + authParam, credentials).pipe(
      map(response => {
        this.setAuth(response.data.user, response.data.expiresIn);
        return response.data.user;
      })
    );
  }

  update(user): Observable<User> {
    return this.apiService.put('/user', user).pipe(
      map(response => {
        this.setAuth(response.data.user, null);
        return response.data.user;
      })
    );
  }

  delete(): Observable<any> {
    return this.apiService.delete('/user').pipe(map(response => {
      this.purgeAuth();
    }));
  }

  purgeAuth() {
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
    this.jwtService.removeToken();

    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private setAuth(user: User, expirationTime: number) {
    if (expirationTime) {

      const dt = new Date().getTime();
      this.setTimer(expirationTime);

      this.jwtService.saveToken(user,  new Date(dt + expirationTime * 1000));
    }

    this.isAuthenticated.next(true);
    this.currentUser.next(user);
  }

  private setTimer(time: number) {
    this.tokenTimer = setTimeout(() => {
      this.purgeAuth();
    }, time * 1000);
  }
}
