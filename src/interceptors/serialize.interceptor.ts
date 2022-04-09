import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

//interface hogy a dto csak object lehessen (typescript miatt)
// interface ClassConstructor {
//   new (...args: any[]): {};
// }

//saját decorator export
export function Serialize(dto) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //minden ami itt van, a request kezelése előtt fut le

    return next.handle().pipe(
      map((data: any) => {
        //minden ami itt van, a response visszaküldése előtt fut le
        //konvertáld a második argumentumban megadott plain objectet
        //az első argumentumban megadott classá
        return plainToInstance(this.dto, data, {
          //csak azokat az adatokat használd fel amik
          //kifejezetten meg vannak jelölve @Expose()-al a dtoban
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
