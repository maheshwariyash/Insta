import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-friendrequest',
  templateUrl: './friendrequest.component.html',
  styleUrls: ['./friendrequest.component.css'],
})
export class FriendrequestComponent implements OnInit {
  user: any = [];
  url = 'http://localhost:8000/';

  constructor(private userservice: LoginService) {
    this.userservice.getFriendReq().subscribe((user: any) => {
      this.user = user[0].user;
    });
  }

  onConfirm(id: any) {
    const uid = { id };
    this.userservice.onFriendReqConfirm(uid).subscribe((user: any) => {
      console.log(user);
      this.userservice.user.next(user);
      // this.userservice.getFriendReq().subscribe((user: any) => {
      //   this.user = user[0].user;
      // });
      this.user = this.user.filter((data: any) => {
        if (data._id != id) {
          return true;
        }
        return false;
      });
    });
  }

  onDelete(id: any) {
    const uid = { id };
    this.userservice.onFriendReqDelete(uid).subscribe((user: any) => {
      console.log(user);
      this.userservice.user.next(user);
      // this.userservice.getFriendReq().subscribe((user: any) => {
      //   this.user = user[0].user;
      // });
      this.user = this.user.filter((data: any) => {
        if (data._id != id) {
          return true;
        }
        return false;
      });
    });
  }

  ngOnInit(): void {}
}
