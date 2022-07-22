import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-friendslist',
  templateUrl: './friendslist.component.html',
  styleUrls: ['./friendslist.component.css'],
})
export class FriendslistComponent implements OnInit {
  user: any = {};
  user1: any = [];
  u1: any = [];
  id: string = '';
  url = 'http://localhost:8000/';
  constructor(
    private userservice: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userservice.user.subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });
    this.route.params.subscribe((param: any) => {
      this.id = param.id;
      console.log(this.id);
      this.getfriend(this.id);
    });
  }

  onUnfriend(id: any) {
    this.userservice.onUnfriend(id).subscribe((data: any) => {
      this.userservice.user.next(data.user);
      this.user = data.user;
      console.log(this.user);
      this.user1 = [];
      this.getfriend(this.id);
    });
  }

  onAddFriend(id: any) {
    // this.userservice.addfriend(id).subscribe((data: any): any => {
    //   console.log('Add friend', data.user1);

    //   this.userservice.user.next(data.user);
    //   this.user = data.user;
    //   this.user1 = [];
    //   this.getfriend(this.id);
    // });
    this.router.navigate(['/home/viewprofile/', id]);
  }

  ngOnInit(): void {}

  getfriend(id: any) {
    this.userservice.getFriendList(id).subscribe((user: any) => {
      this.u1 = user[0].user;
      console.log(this.u1);
      var u2 = [];
      for (let i = 0; i < this.u1.length; i++) {
        u2 = this.user.friends.filter((user: any) => {
          console.log(user);
          if (user.fid == this.u1[i]._id && user.isfriend == true) {
            this.u1[i].isfriend = 'friend';
          } else if (user.fid == this.u1[i]._id && user.isfriend == false) {
            this.u1[i].isfriend = 'sent';
          }
          return false;
        });
        this.user1.push(this.u1[i]);
      }
      console.log(this.user1);
    });
  }
}
