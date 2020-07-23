import { logging } from 'protractor';
import { UserService } from 'src/app/core/services/user.service';

import { Errors } from './../core/models/errors.model';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { User } from './../core/models/user.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProfilesService, Profile } from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfilesService,
    private userService: UserService
  ) {}

  profile: Profile;
  user: User;

  username: string;
  isUser = false;
  isAuthed = false;

  errors: Errors = { error: {} };
  isLoading = true;

  showDropBox1 = false;
  showDropBox2 = false;
  showDropBox3 = false;

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Changing profile');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log("cHANGED")
      this.username = paramMap.get('username');
      this.profileService.get(this.username).subscribe(data => {
        this.userService.currentUserListner.subscribe(user => {

          this.profile = data.profile;
          this.user = user;
          this.isLoading = false;

          if (user) {
            this.isAuthed = true;
          }

          if (user && this.user.username === this.profile.username) {
            this.isUser = true;
          }

        });
      });
    });
  }

  onToggleFollowing(event: Event) {}

  onToggle(variable: number) {
    switch (variable) {
      case 1:
        this.showDropBox1 = this.showDropBox1 === true ? false : true;
        break;
      case 2:
        this.showDropBox2 = this.showDropBox2 === true ? false : true;
        break;
      case 3:
        this.showDropBox3 = this.showDropBox3 === true ? false : true;
        break;
      default:
        this.showDropBox1 = false;
        this.showDropBox2 = false;
        this.showDropBox3 = false;
    }
  }
}
