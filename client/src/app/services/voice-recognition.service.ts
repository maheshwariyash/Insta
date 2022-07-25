const { webkitSpeechRecognition } = window as any;

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isRunning = new BehaviorSubject(false);
  friendsList: any = [];
  user: any;

  constructor(private userservice: LoginService, private router: Router) {
    this.userservice.user.subscribe((data: any) => {
      // if (this?.user) {
      this.user = data;

      this.userservice.getFriendList(this.user._id).subscribe((data: any) => {
        this.friendsList = data[0];
        console.log(this.friendsList);
      });
      // }
    });
  }

  start() {
    this.isRunning.next(true);
    this.recognition.onresult = (event: any) => {
      console.log('event ', event);

      let value = event.results[0][0].transcript;
      console.log(value);
      this.execCommand(value);
      this.isRunning.next(false);
      console.log(this.isRunning.value);
    };
    this.recognition.start();
  }
  abort() {
    this.recognition.abort();
    this.isRunning.next(false);
  }

  execCommand(value: any) {
    console.log(this.friendsList);

    value = value.toLowerCase();
    let args = value.split(' ');

    if (value.includes('scroll')) {
      if (args[1] == 'up' || value == 'scrollup') {
        window.scrollTo(0, scrollY - 600);
      } else if (args[1] == 'down' || value == 'scrolldown') {
        window.scrollTo(0, scrollY + 600);
      } else if (args[1] == 'bottom' || value == 'scrollbottom') {
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else if (args[1] == 'top' || value == 'scrolltop') {
        window.scrollTo(0, 0);
      }
    } else if (value.includes('chat with')) {
      console.log(args[2]);
      const str = new RegExp(`^${args[2]}.+`, 'ig');
      console.log(str);
      // console.log('/^' + 'yash' + '.+/ig');

      // const str1 = '^' + args[2] + '| ' + args[2];
      let user = this.friendsList.user.find((element: any) => {
        console.log(element);

        let result = element.name.toLowerCase().match(str);
        if (result) {
          console.log(result);

          return true;
        }
        return false;

        // ^([a-z]+([ ]?[a-z]+)*)$

        // { name: new RegExp(str1, "i") },
        // { username: new RegExp(str, "i") },
      });
      console.log(user);
      if (user) this.router.navigate(['/home/chat', user._id]);
    }

    // switch (args[0]) {
    //   case 'scroll':
    //     switch (args[1]) {
    //       case 'up':
    //         window.scrollTo(0, scrollY - 600);
    //         break;
    //       case 'down':
    //         window.scrollTo(0, scrollY + 600);
    //         break;
    //       case 'bottom':
    //         window.scrollTo(0, document.documentElement.scrollHeight);
    //         break;
    //       case 'top':
    //         window.scrollTo(0, 0);
    //         break;

    //       default:
    //         break;
    //     }

    //     break;

    //   default:
    //     break;
    // }
    // switch (value.toLowerCase()) {
    //   case 'scroll down':
    //     window.scrollTo(0, scrollY + 600);
    //     break;
    //   case 'scroll up':
    //     window.scrollTo(0, scrollY - 600);
    //     break;
    //   case 'scroll bottom':
    //     window.scrollTo(0, document.documentElement.scrollHeight);
    //     break;
    //   case 'scroll top':
    //     window.scrollTo(0, 0);
    //     break;
    //   case value.includes('chat with'):
    //     console.log(value);

    //     let v = value.split('chat with')[0];
    //     console.log(v);

    //     break;
    //   default:
    //     break;
    // }
  }
}
