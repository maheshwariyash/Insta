import { Component, HostListener, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  feedpost: any;
  url = 'http://localhost:8000/';
  search: string = '';
  userlist: any[] = [];
  currentPage = 0;
  isFetching = false;
  isEndOfData = false;

  constructor(
    private postservice: PostService,
    private userservice: LoginService,
    private loader: LoaderService
  ) {
    this.loader.show();
    this.postservice.getFeedPost(this.currentPage).subscribe((post: any) => {
      console.log('poststs', post);
      this.feedpost = post;
      this.shuffle(this.feedpost);
      this.loader.hide();
    });
  }

  ngOnInit(): void {}

  shuffle(array: any) {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    console.log(array);
    return array;
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      console.log('1');
      console.log(this.isEndOfData);

      if (this.isEndOfData) return;
      console.log('2');

      this.isFetching = true;
      this.currentPage++;
      this.postservice.getFeedPost(this.currentPage).subscribe((data: any) => {
        console.log(data);

        if (data.length == 0) {
          console.log('hii3');
          this.isEndOfData = true;
          return;
        } else {
          console.log('4');
          this.shuffle(data);
          this.feedpost.push(...data);
        }
        console.log('5');

        this.isFetching = false;
      });
    }
  }

  onBlur() {
    setTimeout(() => {
      this.search = '';
      this.userlist = [];
    }, 200);
  }

  findPeople(str: any) {
    console.log(str);
    if (str == '') {
      this.userlist = [];
    } else {
      const obj = { query: str };
      this.userservice.findPeople(obj).subscribe((data: any) => {
        console.log(data);
        this.userlist = data;
      });
    }
  }
}
