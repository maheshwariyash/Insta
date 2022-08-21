import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-friendrequest',
  templateUrl: './friendrequest.component.html',
  styleUrls: ['./friendrequest.component.css'],
})
export class FriendrequestComponent implements OnInit {
  frList: any = [];
  url = 'http://localhost:8000/';
  user: any;
  constructor(
    private userservice: LoginService,
    private socketService: SocketService
  ) {
    this.userservice.user.subscribe((user) => {
      this.user = user;
    });
    this.userservice.getFriendReq();
    this.userservice.friendReqList.subscribe((data) => {
      console.log(data);

      this.frList = data;
    });
  }

  onConfirm(id: any, name: any) {
    const uid = { id };
    this.userservice.onFriendReqConfirm(uid).subscribe((user: any) => {
      console.log(user);
      this.socketService.onConfirmFR(id, this.user);
      this.userservice.user.next(user);
      let data = this.userservice.notifications.getValue();
      data = data.filter((item: any) => {
        if (item.id == id && item.type == 'request') {
          return false;
        } else {
          return true;
        }
      });
      this.frList = this.frList.filter((data: any) => {
        if (data._id != id) {
          return true;
        }
        return false;
      });
      this.userservice.notifications.next(data);
    });
  }

  onDelete(id: any) {
    const uid = { id };
    this.userservice.onFriendReqDelete(uid).subscribe((user: any) => {
      console.log(user);
      this.userservice.user.next(user);
      this.frList = this.frList.filter((data: any) => {
        if (data._id != id) {
          return true;
        }
        return false;
      });
    });
  }

  ngOnInit(): void {}
}
