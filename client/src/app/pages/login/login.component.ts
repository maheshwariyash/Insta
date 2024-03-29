import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, DoCheck {
  loginForm: FormGroup;

  emailTooltipPosition: string = '';
  emailTooltipMessage: string = '';

  passwordTooltipPosition: string = '';
  passwordTooltipMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userservice: LoginService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public authService: AuthService
  ) {
    // this.userservice.user.subscribe((user: any) => {
    //   console.log('asdf', user);
    //   if (user) {
    //     // this.router.navigate(['/home']);
    //   }
    // });
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '([a-zA-Z\\.\\-_]+)?[a-zA-Z]+@[a-z-_]+(\\.[a-z]+){1,}'
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,64})'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    //Email ToolTip
    if (this.loginForm.get('email')?.touched) {
      if (this.loginForm.get('email')?.valid) {
        this.emailTooltipPosition = '';
        this.emailTooltipMessage = '';
      } else {
        //1st Message
        this.emailTooltipPosition = 'right';
        this.emailTooltipMessage = 'Email is required.';

        if (this.loginForm.get('email')?.dirty) {
          //2nd Message
          this.emailTooltipMessage = 'Not a valid email.';
        }
      }
    }
    //Password ToolTip
    if (this.loginForm.get('password')?.touched) {
      if (this.loginForm.get('password')?.valid) {
        this.passwordTooltipPosition = '';
        this.passwordTooltipMessage = '';
      } else {
        //1st Message
        this.passwordTooltipPosition = 'right';
        this.passwordTooltipMessage = 'Password is required.';

        if (this.loginForm.get('password')?.dirty) {
          //2nd Message
          this.passwordTooltipMessage = 'Not a valid password.';
        }
      }
    }
  }
  onSubmitLogin() {
    // console.log(this.loginForm.errors, this.loginForm.get('email')?.invalid);
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.userservice.login(this.loginForm.value);
    } else {
      console.log('not valid');
    }
  }
}
