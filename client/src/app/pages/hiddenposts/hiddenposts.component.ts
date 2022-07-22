import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-hiddenposts',
  templateUrl: './hiddenposts.component.html',
  styleUrls: ['./hiddenposts.component.css'],
})
export class HiddenpostsComponent implements OnInit {
  hiddenpost: any = [];
  url = 'http://localhost:8000/';

  constructor(private postservice: PostService) {
    this.postservice.getHiddenPosts().subscribe((data) => {
      console.log(data);

      this.hiddenpost = data;
    });
  }

  ngOnInit(): void {}
}
