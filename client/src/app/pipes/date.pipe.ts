import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date1',
})
export class DatePipe implements PipeTransform {
  transform(value: any): unknown {
    // console.log(value);
    const date1: any = new Date(value);
    const date2: any = new Date();

    const diffTime: any = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffTime + ' milliseconds');
    // console.log(diffDays + ' days');
    // console.log(today);
    var seconds: any = (diffTime / 1000) % 60;
    var minutes: any = (diffTime / (1000 * 60)) % 60;
    var hours: any = (diffTime / (1000 * 60 * 60)) % 24;

    hours = Math.trunc(hours);
    minutes = Math.trunc(minutes);
    if (hours < 10) {
      hours = hours.toString();
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = minutes.toString();
      minutes = '0' + minutes;
    }

    if (hours == '00') {
      return minutes + ':' + Math.trunc(seconds) + ' mins ago';
    } else {
      if (diffTime / 100 < 864000) {
        return hours + ':' + minutes + ' hours ago';
      }
    }
    return diffDays - 1 + ' days ago';
  }
}
