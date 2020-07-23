import { Subscription } from 'rxjs';
import { UserService } from './../../../core/services/user.service';
import { ProfilesService } from './../../../core/services/profiles.service';
import { Profile } from './../../../core/models/profile.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-buttons',
  templateUrl: './follow-buttons.component.html',
  styleUrls: ['./follow-buttons.component.scss']
})
export class FollowButtonsComponent implements OnInit {
  constructor(
    private profileService: ProfilesService,
    private router: Router,
    private userService: UserService
  ) {}

  @Input() article: Article;
  @Input() profile: Profile;
  @Input() toggler;

  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;
  isUser = false;
  userSub: Subscription;

  ngOnInit(): void {
    this.userService.currentUserListner.subscribe(user => {
      if (user && user.username === this.profile.username) {
        this.isUser = true;
      }
    });
  }

  onToggleFollowing() {
    this.isSubmitting = true;

    this.userService.currentUserListner.subscribe(
      user => {
        if (this.profile.following) {
          this.profile.following = false;
          console.log('unfollowing 1');

          this.profileService.unfollow(this.profile.username).subscribe(
            response => {
              console.log('unfollowing 2');

              this.profile.following = false;
              this.isSubmitting = false;
            },
            err => {
              console.log('failed unfollowing 1');

              this.profile.following = true;
            }
          );
        } else {
          console.log('following 1');

          this.profile.following = true;

          this.profileService.follow(this.profile.username).subscribe(
            response => {
              console.log('following 2');

              this.isSubmitting = false;
              this.profile.following = true;
            },
            err => {
              console.log('failed following 1');

              this.profile.following = false;
            }
          );
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
