import { Profile } from 'selenium-webdriver/firefox';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-profile-meta',
  templateUrl: './profile-meta.component.html',
  styleUrls: ['./profile-meta.component.scss']
})
export class ProfileMetaComponent implements OnInit {
  @Input() profile: Profile;
  isAuthed: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.isAuthenticatedListner.subscribe(isAuthed => {
      this.isAuthed = isAuthed;
    });
  }

}
