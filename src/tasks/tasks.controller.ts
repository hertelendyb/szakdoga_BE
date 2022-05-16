import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TasksInterceptor } from 'src/interceptors/tasks.interceptor';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard)
@Controller('organizations/:id/projects/:projectId/tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  // @Get('/')
  // async listTasks(@Param('projectId', ParseIntPipe) projectId: number) {}

  @UseInterceptors(TasksInterceptor)
  @Post('/')
  async createTask(
    @Body() body: CreateTaskDto,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.taskService.createTask(
      body.name,
      body.description,
      body.deadline,
      projectId,
    );
  }
}
