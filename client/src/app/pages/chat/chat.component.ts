import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PostService } from 'src/app/services/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scroll') scroll: ElementRef;
  id: any;
  data1: any = new BehaviorSubject([]);
  data: any = [];
  user: any = {};
  user1: any = {};
  url = 'http://localhost:8000/';
  chatId: any;
  message = '';
  socket: any;
  newMessages = 0;
  scrollHeight = 0;
  recentChats: any[] = [];
  currentPage = 0;
  isEndOfData = false;
  isFetching = false;

  constructor(
    private chatservice: PostService,
    private route: ActivatedRoute,
    private userservice: LoginService,
    private ref: ChangeDetectorRef,
    private socketservice: SocketService
  ) {
    console.log('chat compo outside-----');

    this.route.params.subscribe((param: any) => {
      console.log('chat compo------------');
      if (this.chatId) {
        console.log('heii hell2');
        this.currentPage = 0;
        this.isEndOfData = false;
        this.isFetching = false;
        this.socketservice.leaveChatRoom({ roomId: this.user1._id });
      }
      this.id = param.id;
      this.chatservice
        .getMessages(param.id, this.currentPage)
        .subscribe((messageData: any) => {
          messageData = messageData.reverse();
          console.log(messageData);
          this.data = messageData;

          this.data1.next(messageData);

          this.chatId = messageData[0]?._id;
          console.log('chatId', this.chatId);

          setTimeout(() => {
            this.scroll.nativeElement.scrollTo(
              0,
              this.scroll.nativeElement.scrollHeight
            );
          }, 10);
        });
      this.userservice.user.subscribe((user) => {
        this.user = user;
      });
      this.userservice.getUserById(param.id).subscribe((user1) => {
        this.user1 = user1;
        this.socketservice.createChatRoom(this.user1);
      });
    });
  }

  ngOnInit(): void {
    this.socketservice.data.subscribe((data) => {
      if (data) this.onReceiveMessage(data);
    });
  }

  onReceiveMessage(data: any) {
    console.log(data);

    if (!this.chatId) {
      this.chatId = data._id;
    }
    console.log('comment');
    data.message.isMine = data.message.sender == this.user._id;

    // this.data1.value.push(data);
    // console.log(this.data1.value);

    this.data.push(data);
    // this.data1.next(this.data);
    // console.log(this.data1.value);

    console.log(this.data);
    this.scrollHeight = this.scroll?.nativeElement?.scrollHeight;
    if (data.message.sender == this.user._id) {
      setTimeout(() => {
        this.scroll.nativeElement.scrollTo(
          0,
          this.scroll.nativeElement.scrollHeight
        );
      }, 10);
    } else {
      if (this.scrollHeight > 710) {
        this.newMessages++;
      }
    }
  }

  ngOnDestroy(): void {
    this.socketservice.leaveChatRoom({ roomId: this.user1._id });
    this.currentPage = 0;
  }

  newMessagescroll() {
    this.scroll.nativeElement.scrollTo(
      0,
      this.scroll.nativeElement.scrollHeight
    );
    this.newMessages = 0;
  }

  getScrollHeight(e: any) {
    if (this.checkVisible(e)) {
      this.newMessages = 0;
      this.scrollHeight = this.scroll.nativeElement.scrollHeight;
    }
    let a = this.scroll.nativeElement.scrollHeight;
    // console.log(e.target);
    if (e.target.scrollTop <= 60) {
      if (this.isEndOfData) return;
      console.log('2');

      this.isFetching = true;
      this.currentPage++;
      this.chatservice
        .getMessages(this.id, this.currentPage)
        .subscribe((messageData: any) => {
          if (messageData.length == 0) {
            console.log('hii3');
            this.isEndOfData = true;
            return;
          } else {
            console.log('4');
            messageData = messageData.reverse();
            console.log('mess', messageData);

            this.data.unshift(...messageData);
            // this.data.push(...data);
          }
          console.log('5');

          this.isFetching = false;
        });
    }
  }

  checkVisible(e: any) {
    var rect = e.target.lastElementChild.getBoundingClientRect();
    var viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    viewHeight -= 100;
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  postMessage() {
    if (this.message.trim().length == 0) {
      console.log('error');
    } else {
      console.log(this.message);
      if (this.data.length == 0) {
        // create group
        const obj = {
          content: this.message,
          uid: this.user._id,
          sid: this.user1._id,
        };
        this.socketservice.createNewChat(obj);
        this.message = '';
      } else {
        //send message
        const obj = {
          content: this.message,
          chatId: this.chatId,
          uid: this.user._id,
          sid: this.user1._id,
        };
        this.socketservice.sendMessage(obj);
        this.message = '';
      }
    }
  }
}
