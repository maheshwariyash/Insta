import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datediv',
  pure: false,
})
export class DatedivPipe implements PipeTransform {
  transform(value: any): any {
    // console.log(value);
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let arr: any[] = [];

    for (let i = 0; i < value.length; i++) {
      var today: any = new Date(value[i].message.timestamp);
      var td: any = new Date(value[i].message.timestamp);
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = mm + '/' + dd + '/' + yyyy;
      if (i != 0) {
        var today1: any = new Date(value[i - 1].message.timestamp);
        var dd = String(today1.getDate()).padStart(2, '0');
        var mm = String(today1.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today1.getFullYear();
      }

      today1 = mm + '/' + dd + '/' + yyyy;
      if (i == 0) {
        let t: any = new Date(value[i].message.timestamp);
        var dd = String(t.getDate()).padStart(2, '0');
        var mmm = t.getMonth();
        var yyyy = t.getFullYear();
        t = dd + ' ' + month[mmm] + ' ' + yyyy;

        let y: any = new Date();
        const diffTime: any = Math.abs(y - td);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var hours: any = (diffTime / (1000 * 60 * 60)) % 24;

        var x = y.toString().split(' ');
        var z = td.toString().split(' ');

        if (hours < 24 && x[1] + x[2] + x[3] == z[1] + z[2] + z[3]) {
          arr.push('Today');
        } else if (diffDays == 1 || (x[2] == z[2] - 1 && diffDays == 2)) {
          arr.push('Yesterday');
        } else {
          arr.push(t);
        }
        arr.push(value[i]);
      } else {
        if (today == today1) {
          arr.push(value[i]);
        } else {
          let t: any = new Date(value[i].message.timestamp);
          var dd = String(t.getDate()).padStart(2, '0');
          var mmm: any = t.getMonth();
          var yyyy = t.getFullYear();
          t = dd + ' ' + month[mmm] + ' ' + yyyy;

          let y: any = new Date();
          const diffTime: any = Math.abs(y - td);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          var hours: any = (diffTime / (1000 * 60 * 60)) % 24;

          var x = y.toString().split(' ');
          var z = td.toString().split(' ');

          if (hours < 24 && x[1] + x[2] + x[3] == z[1] + z[2] + z[3]) {
            arr.push('Today');
          } else if (diffDays == 1 || (x[2] == z[2] - 1 && diffDays == 2)) {
            arr.push('Yesterday');
          } else {
            arr.push(t);
          }
          arr.push(value[i]);
        }
      }
    }

    return arr;
  }
}
