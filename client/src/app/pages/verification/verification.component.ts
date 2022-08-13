import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CustomValidators } from '../../providers/custom-validator';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  isSubmitted = false;
  imageSrc: any;
  profilePic: File;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private userservice: LoginService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  verificationForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    accountType: ['public', Validators.required],
    profilePic: [''],
  });

  checkUsername() {
    this.userservice
      .checkUserExist(this.verificationForm.controls['username'].value)
      .subscribe((data: any) => {
        if (data.userExist) {
          this.verificationForm.controls['username'].setErrors({
            userExist: true,
          });
        }
      });
  }

  onAccountTypeChange(e: any) {
    console.log(e.target.value);
    this.verificationForm.get('accountType')?.setValue(e.target.value);
  }

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.profilePic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.verificationForm.valid) {
      let obj = this.verificationForm.value;
      obj.profilePic = this.profilePic;
      console.log(obj);

      const formData = new FormData();
      const keys = Object.keys(obj);
      for (const key of keys) {
        formData.append(key, obj[key]);
      }
      console.log(this.verificationForm.value);
      console.log(formData);

      this.userservice.userupdated(formData).subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        if (data.isValid) {
          console.log(data.message);
          this.userservice.user.next(data.user);
          this.router.navigate(['/home']);
        } else {
          console.log(data.message);
          this.router.navigate(['/login']);
        }
      });
    } else {
      for (const key of Object.keys(this.verificationForm.controls)) {
        if (this.verificationForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          // invalidControl.scrollIntoView();
          invalidControl.focus();
          window.scrollTo(0, 0);
          break;
        }
      }
      console.log('error occured!!');
    }
  }

  ngOnInit(): void {}
}
