import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {

  transform(value: string | Date): string {
    moment.locale('es');
    return moment(value).format('dddd, D [de] MMMM [de] YYYY');
  }

}