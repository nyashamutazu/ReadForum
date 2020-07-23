import { User } from './../models/user.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private token: string;


  constructor() {}

  getToken() {
    const token = localStorage.getItem('jwtToken');
    const expiration = localStorage.getItem('expiration');

    this.token = token;

    return token ? {token, expirationDate: new Date(expiration)} : null;
  }

  saveToken(user: User, expirationdDate: Date) {
    localStorage.setItem('jwtToken', user.token);
    localStorage.setItem('expiration', expirationdDate.toISOString());
    this.token = user.token;
  }

  removeToken() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('expiration');

    this.token = null;
  }

  sendToken() {
    return this.token;
  }


}
