import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CustomValidators } from '../../providers/custom-validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, DoCheck {
  newAccount!: FormGroup;

  nameTooltipPosition: string = '';
  nameTooltipMessage: string = '';

  phoneNoTooltipPosition: string = '';
  phoneNoTooltipMessage: string = '';

  emailTooltipPosition: string = '';
  emailTooltipMessage: string = '';

  passwordTooltipPosition: string = '';
  passwordTooltipMessage: string = '';

  confirmPasswordTooltipPosition: string = '';
  confirmPasswordTooltipMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private userservice: LoginService,
    public authService: AuthService
  ) {
    // this.userservice.user.subscribe((user: any) => {
    //   console.log('asdf', user);
    //   if (user) {
    //     this.router.navigate(['/home']);
    //   }
    // });
    // console.log('helllllllehhoo');

    this.newAccount = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[a-z A-Z]+$'),
          ],
        ],
        phoneNo: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(13),
            Validators.pattern('\\b[6-9]{1}\\d{2}[-.]?\\d{3}[-.]?\\d{4}\\b'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '([a-zA-Z\\.\\-_]+)?[a-zA-Z]+@[a-z-_]+(\\.[a-z]+){1,}'
            ),
          ],
        ],
        //- at least 8 characters
        // - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
        // - Can contain special characters
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z]).{8,64})'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: CustomValidators.mustMatch('password', 'confirmPassword') }
    );
  }

  ngOnInit(): void {}
  ngDoCheck(): void {
    //Full Name ToolTip
    if (this.newAccount.get('name')?.touched) {
      if (this.newAccount.get('name')?.valid) {
        this.nameTooltipPosition = '';
        this.nameTooltipMessage = '';
      } else {
        //1st Message
        this.nameTooltipPosition = 'top';
        this.nameTooltipMessage = 'Full Name is required.';

        if (this.newAccount.get('name')?.dirty) {
          //2nd Message
          this.nameTooltipMessage =
            'Use only alphabets and lenght should be less the 30.';
        }
      }
    }
    //Phone Number ToolTip
    if (this.newAccount.get('phoneNo')?.touched) {
      if (this.newAccount.get('phoneNo')?.valid) {
        this.phoneNoTooltipPosition = '';
        this.phoneNoTooltipMessage = '';
      } else {
        //1st Message
        this.phoneNoTooltipPosition = 'top';
        this.phoneNoTooltipMessage = 'Phone number is required.';

        if (this.newAccount.get('phoneNo')?.dirty) {
          //2nd Message
          this.phoneNoTooltipMessage =
            'Use only numeric values and lenght must be between 0-10.';
        }
      }
    }
    //Email ToolTip
    if (this.newAccount.get('email')?.touched) {
      if (this.newAccount.get('email')?.valid) {
        this.emailTooltipPosition = '';
        this.emailTooltipMessage = '';
      } else {
        //1st Message
        this.emailTooltipPosition = 'right';
        this.emailTooltipMessage = 'Email is required.';

        if (this.newAccount.get('email')?.dirty) {
          //2nd Message
          this.emailTooltipMessage = 'Not a valid email.';
        }
      }
    }
    //Password ToolTip
    if (this.newAccount.get('password')?.touched) {
      if (this.newAccount.get('password')?.valid) {
        this.passwordTooltipPosition = '';
        this.passwordTooltipMessage = '';
      } else {
        //1st Message
        this.passwordTooltipPosition = 'bottom';
        this.passwordTooltipMessage = 'Password is required.';

        if (this.newAccount.get('password')?.dirty) {
          //2nd Message
          this.passwordTooltipMessage =
            'Ensure that password is 8 to 64 characters long and contains a mix of upper and lower case characters, one numeric and one special character.';
        }
      }
    }
    //Confirm Password ToolTip
    if (this.newAccount.get('confirmPassword')?.touched) {
      if (this.newAccount.get('confirmPassword')?.valid) {
        this.confirmPasswordTooltipPosition = '';
        this.confirmPasswordTooltipMessage = '';
      } else {
        //1st Message
        this.confirmPasswordTooltipPosition = 'bottom';
        this.confirmPasswordTooltipMessage = 'Confirm Password is required.';

        if (this.newAccount.get('confirmPassword')?.dirty) {
          //2nd Message
          this.confirmPasswordTooltipMessage =
            'Passowrd and Confirm Password does not match.';
        }
      }
    }
  }

  onSubmit() {
    console.log(this.newAccount);
    if (this.newAccount.valid) {
      console.log(this.newAccount.value);
      this.userservice.register(this.newAccount.value);
    } else {
      console.log('not valid');
    }
  }
}
