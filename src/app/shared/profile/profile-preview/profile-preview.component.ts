import { Profile } from './../../../core/models/profile.model';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss']
})
export class ProfilePreviewComponent implements OnInit {
  @Input() profile: Profile;
  isUser = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUserListner.subscribe(user => {
      if (user && user.username !== this.profile.username) {
        this.isUser = (user.username !== this.profile.username);
      }
    });
  }

}
