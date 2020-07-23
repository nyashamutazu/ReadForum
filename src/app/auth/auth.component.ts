import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authType = '';
  title = '';
  errors: Errors = { error: {} };
  isSubmitting = false;
  signUpForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      username: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required]
      }),
      emailRepeat: new FormControl(null, {
        validators: [Validators.email, Validators.required]
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
      passwordRepeat: new FormControl(null, {
        validators: [Validators.required]
      }),
      checkbox: new FormControl(false, { validators: [Validators.required] })
    });

    this.loginForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required]
      }),
      password: new FormControl(null, { validators: [Validators.required] })
    });

    this.route.url.subscribe(data => {
      // Getting the last URL param, in this case either sign-up or sign-in
      this.authType = data[data.length - 1].path;
      // Setting the title accordingly
      this.title = this.authType === 'sign-in' ? 'Sign In' : 'Sign Up';
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = { error: {} };

    if (this.authType === 'sign-up' && this.signUpForm.valid) {
      if (
        this.checkMatch(
          this.signUpForm.get('password').value,
          this.signUpForm.get('passwordRepeat').value
        ) &&
        this.checkMatch(
          this.signUpForm.get('email').value,
          this.signUpForm.get('emailRepeat').value
        )
      ) {
        this.userService
          .attemptAuth(this.authType, this.signUpForm.value)
          .subscribe(
            data => {

              this.router.navigate(['/settings']);
            },
            err => {
              console.log('Errror', err);
              this.errors = err;
              this.isSubmitting = false;
              this.signUpForm.reset();
            }
          );
      } else {
        console.log('Please make sure your password or email matches');
      }
    } else if (this.authType === 'sign-in' && this.loginForm.valid) {
      this.userService
        .attemptAuth(this.authType, this.loginForm.value)
        .subscribe(
          data => {
            this.router.navigate(['/']);
          },
          err => {
            console.log('Errror', err);

            this.errors = err;
            this.isSubmitting = false;
            this.loginForm.reset();
          }
        );
    } else {
      this.errors.error['Incorrect credentials'] = 'incorrect credentials';
    }

    this.isSubmitting = false;
    return;
  }

  private checkMatch(feature: string, repeatFeature: string) {
    return repeatFeature === feature ? true : false;
  }
}
