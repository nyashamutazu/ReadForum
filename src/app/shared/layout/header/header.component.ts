import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { User } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null, { validators: [Validators.required] }),
      radio: new FormControl('account', { validators: [Validators.required] })
    });

    this.authSub = this.userService.currentUserListner.subscribe(user => {
      this.user = user;
    });
  }

  onSignOut() {
    this.userService.purgeAuth();
  }

  search() {
    if (this.searchForm.valid) {
      this.router.navigate(['search', this.searchForm.get('radio').value], {
        queryParams: { q: this.searchForm.get('search').value }
      });
    }
    return;
  }
}
