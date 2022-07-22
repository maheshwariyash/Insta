import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatsort',
})
export class ChatsortPipe implements PipeTransform {
  transform(value: any): any {
    // console.log(value.comments);

    if (value[0]?.lastmsg) {
      value.sort((a: any, b: any) => {
        const date1 = new Date(b.lastmsg.timestamp).getTime();
        const date2 = new Date(a.lastmsg.timestamp).getTime();
        return date1 - date2;
      });
    } else {
      value.sort((a: any, b: any) => {
        const date1 = new Date(b.comments.timestamp).getTime();
        const date2 = new Date(a.comments.timestamp).getTime();
        return date1 - date2;
      });
    }
    return value;
  }
}
