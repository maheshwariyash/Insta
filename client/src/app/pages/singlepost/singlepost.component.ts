import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';
import { io } from 'socket.io-client';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-singlepost',
  templateUrl: './singlepost.component.html',
  styleUrls: ['./singlepost.component.css'],
})
export class SinglepostComponent implements OnInit, OnDestroy {
  id: any;
  post: any = {};
  user1: any = {};
  user: any = {};
  url = 'http://localhost:8000/';
  friend: any = [];
  commentdata: any[] = [];
  comment = '';
  socket: any;
  isLiked: any;
  isHidden: any;

  constructor(
    private route: ActivatedRoute,
    private postservice: PostService,
    private userservice: LoginService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private loader: LoaderService
  ) {
    this.route.params.subscribe((param: any) => {
      console.log('loading');

      this.loader.show();
      this.id = param.id;
      this.userservice.user.subscribe((user: any) => {
        this.user = user;
        console.log('user0', this.user);
      });
      this.postservice.getPostById(this.id).subscribe((data: any) => {
        console.log('load1');

        this.post = data.post;
        this.user1 = data.user[0];
        console.log(this.post);
        console.log(this.user1);

        console.log('userrr', this.user1);
        if (!this.user1) {
          this._snackBar.open('Posted Deleted', 'ok', {
            duration: 3000,
          });
          this.router.navigate(['/home/viewprofile/', this.user._id]);
        }

        // post liked or not
        this.isLiked = this.post.likedBy.includes(this.user._id);

        // post hidden or not
        this.isHidden = this.post.hiddenBy.includes(this.user._id);

        // is friend or not
        this.friend = this.user1.friends.filter((friend: any) => {
          if (friend.fid == this.user?._id) {
            return true;
          }
          return false;
        });
        this.loader.hide();
      });
      this.postservice.getcomments(this.id).subscribe((data: any) => {
        console.log(data);
        this.commentdata = data;
      });

      this.socket = io('ws://localhost:8000');
      console.log('hell');
      this.socket.on('connect', () => {
        console.log('new user connected');
        this.socket.emit('userdata', {
          postId: this.id,
          userId: this.user._id,
        });

        this.socket.on('receiveComment', (data: any) => {
          console.log(this.id);
          if (this.id == data._id) {
            console.log('comment');
            this.commentdata.push(data);
            console.log(this.commentdata);
          }
        });
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.socket.emit('userleave', { postId: this.id });
  }

  postComment(pid: any) {
    if (this.comment.trim().length == 0) {
      console.log('error');
    }
    console.log(this.comment);
    const obj = { content: this.comment, pid, uid: this.user._id };
    this.socket.emit('sendComment', obj);
    this.comment = '';
  }

  onUnfriend(id: any) {
    this.userservice.onUnfriend(id).subscribe((data: any) => {
      this.userservice.user.next(data.user);
      this.user = data.user;
      history.back();
    });
  }

  onAddFriend() {
    this.userservice.addfriend(this.user1._id).subscribe((data: any): any => {
      console.log('Add friend', data.user1);

      // this.userservice.user.next(data.user);
      // this.user = data.user;
      this.user1 = data.user1;
      this.friend = this.user1.friends.filter((friend: any) => {
        if (friend.fid == this.user?._id) {
          return true;
        }
        return false;
      });
    });
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

  onDeletePost() {
    this.postservice.deletePostById(this.id).subscribe((data: any) => {
      this._snackBar.open(data.message, 'ok', {
        duration: 3000,
      });
      console.log('datat', data);
      this.userservice.user.next(data.user);
      this.router.navigate(['/home/viewprofile/', this.user._id]);
    });
  }

  hidePost(id: any) {
    this.postservice.toHidePost(id);
    this.isHidden = true;
  }

  unhidePost(id: any) {
    this.postservice.toUnhidePost(id);
    this.isHidden = false;
  }
}
