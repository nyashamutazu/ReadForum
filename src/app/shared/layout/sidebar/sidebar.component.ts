import { Subscription } from 'rxjs';
import { User } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: User;
  isAuthenticated = false;
  authSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // this.authSub = this.userService.getIsAuthenticatedListner().subscribe(isAuthed => {
    //   this.isAuthenticated = isAuthed;
    // });
  }

  onSignOut() {
    this.userService.purgeAuth();
  }

}
