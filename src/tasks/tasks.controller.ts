import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { TasksInterceptor } from 'src/interceptors/tasks.interceptor';
import { AddCommentDto } from './dtos/add-comment.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('api/organizations/:id/projects/:projectId/tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Get('/')
  async listTasks(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.taskService.listTasks(projectId);
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Post('/')
  async createTask(
    @Body() body: CreateTaskDto,
    @Session() session: any,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.taskService.createTask(
      body.name,
      body.description,
      body.deadline,
      body.assigneeId,
      body.order,
      projectId,
      session.passport.user,
    );
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Post('/:taskId')
  async createSubTask(
    @Body() body: CreateTaskDto,
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.createSubTask(
      body.name,
      body.description,
      body.deadline,
      taskId,
      body.assigneeId,
      session.passport.user,
    );
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Patch('/:taskId')
  async editTask(
    @Body() body: Partial<CreateTaskDto>,
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.editTask(taskId, session.passport.user, body);
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Patch('/:taskId/move')
  async moveTask(
    @Body() body: Partial<CreateTaskDto>,
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.moveTask(taskId, session.passport.user, body);
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Get('/:taskId')
  async listOneTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.listOneTask(taskId);
  }

  @Roles(1, 2)
  @Delete('/:taskId')
  async deleteTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTask(taskId);
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Post('/:taskId/add-comment')
  async addComment(
    @Body() body: AddCommentDto,
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.addComment(
      taskId,
      session.passport.user,
      body.text,
    );
  }

  @Roles(1, 2, 3)
  @Delete('/:taskId/delete-comment/:commentId')
  async deleteComment(
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.taskService.deleteComment(
      taskId,
      commentId,
      session.passport.user,
    );
  }

  @Roles(1, 2, 3)
  @Patch('/:taskId/edit-comment/:commentId')
  async editComment(
    @Body() body: Partial<AddCommentDto>,
    @Session() session: any,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.taskService.editComment(
      taskId,
      commentId,
      session.passport.user,
      body.text,
    );
  }

  @Roles(1, 2, 3)
  @UseInterceptors(TasksInterceptor)
  @Get('/:taskId/logs')
  async getLogs(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskService.getLogs(taskId);
  }
}
