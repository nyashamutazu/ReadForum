import { UserService } from 'src/app/core/services/user.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NoAuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.isAuthenticatedListner.pipe(take(1), map(isAuth => !isAuth));
  }
}
