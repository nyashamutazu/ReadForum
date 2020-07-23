import { UserService } from 'src/app/core/services/user.service';
import { User } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  isAuthenticated = false;
  authSub: Subscription;

  searchForm: FormGroup;

  constructor(private userService: UserService ) { }

  ngOnInit(): void {
    this.authSub = this.userService.currentUserListner.subscribe(user => {
      this.user = user;
    });
  }

  onSignOut() {
    this.userService.purgeAuth();
  }

}
