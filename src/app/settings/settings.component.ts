import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { validate } from 'json-schema';
import { Errors } from '../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private router: Router) { }

  user: User;
  settingsForm: FormGroup;
  errors: Errors = {error: {}};
  userSub: Subscription;
  isLoading = true;


  ngOnInit(): void {
    this.isLoading = true;

    this.settingsForm = new FormGroup({
      profileImage: new FormControl(null),
      username: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      // password: new FormControl(null, {validators: [Validators.required]}),
      // passwordRepeat: new FormControl(null, {validators: [Validators.required]}),
      bio: new FormControl(null)
    });

    this.userSub = this.userService.getUser().subscribe(response => {
      const settingUser = response.data.user;
      this.settingsForm.setValue({
        profileImage: settingUser.profileImage,
        username: settingUser.username,
        bio: settingUser.bio,
        email: settingUser.email,
        // password: null,
        // passwordRepeat: null
      });
      this.isLoading = false;

    }, err => {
      console.log('Failed to find user');
    });

  }

  onImagePicked(event: Event) {

  }

  submitSettings() {
    this.isLoading = true;

    if (this.settingsForm.valid) {

      this.userService.update(this.settingsForm.value).subscribe(result => {
        this.router.navigate(['/']);
      }, err => {
        console.log('SubmitSettings failed');
      });
    }
  }

  onDeactivateAcount() {
    this.userService.delete().subscribe(response => {

    });
  }

  onSignOut() {
    this.userService.purgeAuth();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
