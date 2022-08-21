import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userservice: LoginService,
    private _snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.forgotForm.valid) {
      let data = this.forgotForm.controls['email'].value;
      console.log(data);
      this.userservice.forgotPassword(data).subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        console.log(data);
      });
    }
  }
}
