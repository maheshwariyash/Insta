import { Component, DoCheck, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css'],
})
export class ViewprofileComponent implements OnInit, DoCheck {
  friend: any = [];
  noOfFriends: any = [];
  id: any;
  isSubmitted = false;
  profilePic: any;
  user: any = {};
  user1: any = {};
  url = 'http://localhost:8000/';
  imageSrc: any = '';
  postarr: any = [];
  isValid = false;

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private userservice: LoginService,
    private _snackBar: MatSnackBar,
    private postservice: PostService,
    private route: ActivatedRoute,
    private loader: LoaderService
  ) {
    this.route.params.subscribe((param: any) => {
      this.loader.show();
      this.id = param.id;
      this.postservice.getuserpostById(this.id).subscribe((data: any) => {
        this.postarr = data.posts;
        console.log(this.postarr);
        console.log(data);
        this.user1 = data;
        // });
        this.userservice.user.subscribe((user: any) => {
          this.user = user;
          console.log('user', this.user);
        });
        // this.userservice.getUserById(this.id).subscribe((user: any) => {
        console.log('user1', this.user1);

        // is friend or not
        this.friend = this.user1.friends.filter((friend: any) => {
          if (friend.fid == this.user?._id) {
            return true;
          }
          return false;
        });

        this.noOfFriends = this.user1.friends.filter((friend: any) => {
          if (friend.isfriend == true) {
            return true;
          }
          return false;
        });
        console.log(this.noOfFriends);

        console.log(this.friend);
        this.loader.hide();
      });
    });
  }

  ngOnInit(): void {}

  ngDoCheck() {
    if (this.updateForm.invalid) {
      this.isValid = false;
    }
    if (this.updateForm.valid) {
      this.isValid = true;
    }
  }

  onModalOpen() {
    this.updateForm.get('name')?.setValue(this.user1?.name);
    this.updateForm.get('username')?.setValue(this.user1?.username);
    this.updateForm.get('accountType')?.setValue(this.user1?.accountType);
    this.imageSrc = `${this.url}${this.user1?.profilePic}`;
  }

  updateForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    profilePic: [''],
    accountType: ['', Validators.required],
  });

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.profilePic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(file);
    }
  }

  onAddFriend() {
    this.userservice.addfriend(this.id).subscribe((data: any): any => {
      console.log('Add friend', data.user1);

      // this.userservice.user.next(data.user);
      // this.user = data.user;
      this.user1 = data.user1;
      this.friend = this.user1.friends.filter((friend: any) => {
        if (friend.fid == this.user?._id) {
          return true;
        }
        return false;
      });
    });
  }

  onUnfriend(id: any) {
    this.userservice.onUnfriend(id).subscribe((data: any) => {
      this.user1 = data.user1;
      this.friend = this.user1.friends.filter((friend: any) => {
        if (friend.fid == this.user?._id) {
          return true;
        }
        return false;
      });
    });
  }

  onUpdate() {
    this.isSubmitted = true;

    const y: any = document.getElementById('remove');

    if (this.updateForm.valid) {
      let obj = this.updateForm.value;
      console.log(obj);
      obj.profilePic = this.profilePic;
      if (y.checked) {
        obj.checked = true;
      }
      const formData = new FormData();
      const keys = Object.keys(obj);
      for (const key of keys) {
        formData.append(key, obj[key]);
      }
      this.userservice.userupdated(formData).subscribe((data: any) => {
        this._snackBar.open(data.message, 'ok', {
          duration: 3000,
        });
        if (data.isValid) {
          console.log(data.message);
          console.log(data.user);

          // window.location.reload();
          this.user1 = data.user;
          this.imageSrc = `${this.url}${this.user1?.profilePic}`;
          this.profilePic = null;
          console.log(this.user1);
          y.checked = false;
          this.userservice.user.next(data.user);
        }
      });
      // const myModal = document.getElementById('editmodal');
      // const onModelCloseListner = () => {
      //   myModal?.removeEventListener('hidden.bs.modal', onModelCloseListner);
      // };
      // myModal?.addEventListener('hidden.bs.modal', onModelCloseListner);
    } else {
      // for (const key of Object.keys(this.updateForm.controls)) {
      //   if (this.updateForm.controls[key].invalid) {
      //     const invalidControl = this.el.nativeElement.querySelector(
      //       '[formcontrolname="' + key + '"]'
      //     );
      //     // invalidControl.scrollIntoView();
      //     invalidControl.focus();
      //     window.scrollTo(0, 0);
      //     break;
      //   }
      // }
      console.log('error occured!!');
    }
  }
}
