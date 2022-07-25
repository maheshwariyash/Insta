import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { io } from 'socket.io-client';
import { LoginService } from 'src/app/services/login.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() userName = '';
  @Input() image = '';

  socket: any;
  color = 'none';
  borderColor = 'black';
  islike = false;
  url = 'http://localhost:8000/';
  data: any[] = [];
  commentdata: any = [];
  comment = '';
  user: any = {};
  postid: string;
  currentPage = 0;
  arr!: any;
  isFetching = false;
  isEndOfData = false;

  constructor(
    private route: ActivatedRoute,
    private postservice: PostService,
    private userservice: LoginService,
    private loader: LoaderService
  ) {
    this.userservice.user.subscribe((user: any) => {
      this.loader.show();
      this.user = user;
    });
    this.postservice.getHomePost(this.currentPage).subscribe((data: any) => {
      console.log(data);
      this.data = data;
      this.loader.hide();
    });
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      console.log('1');
      console.log(this.isEndOfData);

      if (this.isEndOfData) return;
      console.log('2');

      this.isFetching = true;
      this.currentPage++;
      this.postservice.getHomePost(this.currentPage).subscribe((data: any) => {
        console.log(data);

        if (data.length == 0) {
          console.log('hii3');
          this.isEndOfData = true;
          return;
        } else {
          console.log('4');

          this.data.push(...data);
        }
        console.log('5');

        this.isFetching = false;
      });
    }
  }

  ngOnInit(): void {
    this.socket = io('ws://localhost:8000');
    console.log('hell');
    this.socket.on('connect', () => {
      this.socket.on('receiveComment', (data: any) => {
        console.log(this.postid);
        if (this.postid == data._id) {
          console.log('comment');
          this.commentdata.unshift(data);
          console.log(this.commentdata);
        }
      });
    });
  }

  onModalOpen(id: any, pid: any): any {
    this.postid = pid;
    const myModal = document.getElementById(id);

    this.postservice.getcomments(pid).subscribe((data: any) => {
      console.log(data);
      this.commentdata = data;
    });

    // this.socket.on('connect', async () => {
    console.log('new user connected');
    this.socket.emit('userdata', {
      postId: pid,
      userId: this.user._id,
    });

    const onModelCloseListner = () => {
      console.log('modal open', id);
      console.log(this.commentdata);

      this.data = this.data.filter((data: any) => {
        if (data.post[0]._id == pid) {
          console.log(data.post[0]);
          data.post[0].comments = this.commentdata;
        }
        return true;
      });
      this.socket.emit('userleave', { postId: pid });
      myModal?.removeEventListener('hidden.bs.modal', onModelCloseListner);
    };
    myModal?.addEventListener('hidden.bs.modal', onModelCloseListner);
  }

  postComment(pid: any) {
    if (this.comment.trim().length == 0) {
      console.log('error');
    } else {
      console.log(this.comment);
      const obj = { content: this.comment, pid, uid: this.user._id };
      this.socket.emit('sendComment', obj);
      this.comment = '';
    }
  }

  like(id: any) {
    console.log('like');

    var postlike: any = document.getElementById(id);
    var likecount: any = document.getElementsByClassName(id);
    var count = likecount[0].innerHTML;

    // this.islike = !this.islike;
    if (postlike.getAttribute('fill') == 'red') {
      this.postservice.toUnlikePost(id);
      postlike?.setAttribute('fill', 'none');
      postlike?.setAttribute('stroke', 'black');
      count--;
      likecount[0].innerHTML = `${count}`;

      // likecount[0].innerHTML = `${count++} Likes`;
    } else {
      this.postservice.toLikePost(id);
      postlike?.setAttribute('fill', 'red');
      postlike?.setAttribute('stroke', 'red');
      count++;
      likecount[0].innerHTML = `${count}`;

      // likecount[0].innerHTML = `${count--} Likes`;
    }
  }

  hidePost(id: any) {
    this.postservice.toHidePost(id);
    this.data = this.data.filter((data: any) => {
      if (data.post[0]?._id != id) {
        return true;
      }
      return false;
    });
  }

  onUnfriend(id: any) {
    this.userservice.onUnfriend(id).subscribe((data: any) => {
      this.userservice.user.next(data.user);
      this.user = data.user;
    });
    // this.postservice.getHomePost().subscribe((data: any) => {
    //   console.log(data);
    //   // this.data = [];
    //   this.data = data;
    // });
    this.data = this.data.filter((data: any) => {
      if (data.user._id != id) {
        return true;
      }
      return false;
    });
  }
}

// [attr.fill]="color" [attr.stroke]="borderColor
