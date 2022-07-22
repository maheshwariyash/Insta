import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-likedposts',
  templateUrl: './likedposts.component.html',
  styleUrls: ['./likedposts.component.css'],
})
export class LikedpostsComponent implements OnInit {
  likedpost: any = [];
  url = 'http://localhost:8000/';

  constructor(private postservice: PostService) {
    this.postservice.getLikedPosts().subscribe((data) => {
      this.likedpost = data;
    });
  }

  ngOnInit(): void {}
}
