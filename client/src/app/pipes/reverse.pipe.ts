import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
  transform(value: any[]): any[] {
    console.log(value);

    // let x = [...value].reverse();
    // console.log(x);

    return value;
  }
}
