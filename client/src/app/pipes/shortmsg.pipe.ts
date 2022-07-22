import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortmsg',
})
export class ShortmsgPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length > 12) {
      let a = value.slice(0, 12);

      return a + '...';
    }
    return value;
  }
}
