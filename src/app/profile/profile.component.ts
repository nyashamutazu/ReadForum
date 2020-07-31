import { ProfilesService } from './../core/services/profiles.service';
import { UserService } from 'src/app/core/services/user.service';

import { Errors } from './../core/models/errors.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { Profile } from '../core';
import { concatMap, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private profileService: ProfilesService
  ) {}

  profile: Profile;
  user: User;

  username: string;
  isUser = false;
  isAuthed = false;

  errors: Errors = { error: {} };
  isLoading = true;

  ngOnInit(): void {
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      this.profileService.get(paramMap.get('username')).subscribe(response => {
        this.userService.currentUserListner.subscribe(user => {
          this.profile = response.profile;

          this.user = user;

          if (user) {
            this.isAuthed = true;
          }

          if (user && this.user.username === this.profile.username) {
            this.isUser = true;
          }
          this.isLoading = false;
        });
      });
    });
  }

  onToggleFollowing(event: Event) {}

  onSignOut() {

  }

  onRestrictAccount(){

  }

  onBlockAccount() {

  }

  onReportAccount() {

  }

  onHideAccount() {

  }

  onFollowAccount() {

  }

  onShareAccount() {

  }
}
