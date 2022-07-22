import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentdate',
})
export class CommentdatePipe implements PipeTransform {
  transform(value: any): any {
    console.log(value);

    var data = new Date(value);
    var date = data.getDate();
    // var month = data.getMonth();
    var month = data.toLocaleString('default', { month: 'short' });
    var hour: any = data.getHours();
    var minute: any = data.getMinutes();

    if (hour < 10) {
      hour = hour.toString();
      hour = '0' + hour;
    }
    if (minute < 10) {
      minute = minute.toString();
      minute = '0' + minute;
    }

    return date + ' ' + month + ' ' + hour + ':' + minute;
  }
}
