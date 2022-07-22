import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  image: File;
  imageSrc!: any;
  isSubmited = false;
  constructor(
    private postservice: PostService,
    private _snackBar: MatSnackBar,
    private userservice: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.image = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: any) {
    this.isSubmited = true;
    if (!form.valid) {
      console.log(form);
      console.log('error');
    } else {
      let obj = form.value;
      obj.image = this.image;
      console.log(obj);

      const formData = new FormData();
      const keys = Object.keys(obj);
      for (const key of keys) {
        formData.append(key, obj[key]);
      }
      this.postservice.addpost(formData).subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        if (data.isValid) {
          this.userservice.user.next(data.user);
          this.router.navigate(['/home/viewprofile/', data.user._id]);
        } else {
          console.log('error');
        }
      });
    }
  }
}
