import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.jwtService.sendToken();

    const authRequest = req.clone({
      headers: req.headers.set('Authorisation', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
