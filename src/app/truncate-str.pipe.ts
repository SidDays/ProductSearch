import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateStr' })
export class TruncateStr implements PipeTransform {
  transform(value: string): string {
    if (value.length > 35) {
      const spaceIndex = value.substring(0, 36).lastIndexOf(" ");
      return value.substring(0, spaceIndex) + "…";
    } else {
      return value;
    }
  }
}
