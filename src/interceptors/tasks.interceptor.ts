import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { omit } from 'lodash';

@Injectable()
export class TasksInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body.deadline) {
      request.body.deadline = new Date(request.body.deadline);
    }
    return next.handle().pipe(
      map((data) => {
        if (data.assignee) {
          return omit(data, 'assignee.password');
        }
        return data;
      }),
    );
  }
}
