import {
  Body,
  Controller,
  Delete,
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

  @Get('/')
  async listTasks(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.taskService.listTasks(projectId);
  }

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
      body.assigneeId,
      projectId,
    );
  }

  @UseInterceptors(TasksInterceptor)
  @Post('/:taskId')
  async createSubTask(
    @Body() body: CreateTaskDto,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.createSubTask(
      body.name,
      body.description,
      body.deadline,
      taskId,
    );
  }

  @Get('/:taskId')
  async listOneTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.listOneTask(taskId);
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTask(taskId);
  }
}
