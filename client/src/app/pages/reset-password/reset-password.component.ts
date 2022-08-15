import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../providers/custom-validator';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private changePass: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {
    this.form = this.changePass.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{8,}'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: CustomValidators.mustMatch('password', 'confirmPassword'),
      }
    );
  }
  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      console.log(params.resetToken);
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    const obj = this.form.value;
    // console.log(obj);
    this.form.reset();

    // this.loginService.resetPassService(obj).subscribe((data) => {
    //   console.log('done');
    // });
  }
}
