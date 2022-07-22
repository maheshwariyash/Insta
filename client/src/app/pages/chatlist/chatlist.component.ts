import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css'],
})
export class ChatlistComponent implements OnInit {
  recentchats: any = [];
  url = 'http://localhost:8000/';

  constructor(private chatservice: PostService) {
    this.chatservice.recentChats.subscribe((data) => {
      this.recentchats = data;
    });
  }

  ngOnInit(): void {}
}
