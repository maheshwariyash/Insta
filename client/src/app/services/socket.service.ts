import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { LoginService } from './login.service';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket!: io.Socket<DefaultEventsMap, DefaultEventsMap>;
  user: any = {};
  user1: any;
  data: BehaviorSubject<any> = new BehaviorSubject(undefined);
  recentChats: any[] = [];
  obj: any;
  data1: any;

  constructor(
    private userservice: LoginService,
    private chatservice: PostService
  ) {
    console.log('calling to home!!');

    this.userservice.user.subscribe((data) => {
      this.user = data;
    });

    this.chatservice.recentChats.subscribe((data) => {
      this.recentChats = data;
      console.log(this.recentChats);
    });

    this.socket = io.connect('ws://localhost:8000');
    this.socket.on('connect', () => {
      this.socket.emit('chatUserRoom', {
        userId: this.user._id,
      });
      this.socket.on('receiveMessage', async (data: any) => {
        this.data.next(data);
        this.data1 = data;

        this.userservice
          .getUserById(data.message.sender)
          .subscribe((data: any) => {
            console.log(data);
            this.user1 = data;
            console.log('this.data', this.data1);

            this.onReceivingMessage(this.data1);
          });
      });
    });
  }

  onReceivingMessage(data: any) {
    if (this.user._id == data.message.sender) {
      console.log('1');

      const user = {
        name: data.user1.name,
        username: data.user1.username,
        profilePic: data.user1.profilePic,
        _id: data.user1._id,
      };
      this.obj = { chatId: data._id, lastmsg: data.message, user };
    } else {
      console.log('2');
      console.log(data.message.sender);
      const user = {
        name: this.user1.name,
        username: this.user1.username,
        profilePic: this.user1.profilePic,
        _id: this.user1._id,
      };
      this.obj = { chatId: data._id, lastmsg: data.message, user };
    }
    if (this.recentChats.length == 0) {
      this.recentChats.push(this.obj);
      this.chatservice.recentChats.next(this.recentChats);
    } else {
      let updatedchat = this.recentChats.filter((data: any) => {
        if (data.chatId != this.obj.chatId) {
          return true;
        }
        return false;
      });
      updatedchat.push(this.obj);
      this.chatservice.recentChats.next(updatedchat);
    }
  }

  createChatRoom(user1: any) {
    console.log('user1', user1);

    this.socket.emit('chatdata', {
      user1,
    });
  }

  createNewChat(obj: any) {
    this.socket.emit('createChat', obj);
  }

  sendMessage(obj: any) {
    this.socket.emit('sendMessage', obj);
  }

  leaveChatRoom(roomId: any) {
    console.log(roomId);

    this.socket.emit('chatleave', roomId);
  }
}
