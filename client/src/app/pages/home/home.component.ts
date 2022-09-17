import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private postservice: PostService,
    private socketservice: SocketService,
    private userservice: LoginService
  ) {
    this.postservice.getRecentChats();
    this.userservice.getNotification();
  }

  ngOnInit(): void {}
}
