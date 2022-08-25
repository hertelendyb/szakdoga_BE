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
        if (data.length) {
          data.map((task) => omit(task, 'assignee.password'));
        }
        if (data.assignee) {
          omit(data, 'assignee.password');
        }
        if (data.author) {
          omit(data, 'author.password');
        }
        if (data.comments) {
          data.comments.map((comment) => omit(comment, 'author.password'));
        }
        return data;
      }),
    );
  }
}
