import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private userservice: LoginService) {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    let data = this.forgotForm.controls['email'].value;
    console.log(data);
    this.userservice.forgotPassword(data).subscribe((data: any) => {
      console.log(data);
    });
  }
}
