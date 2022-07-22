import { Component, OnInit } from '@angular/core';
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
    private socketservice: SocketService
  ) {
    this.postservice.getRecentChats();
  }

  ngOnInit(): void {}
}
