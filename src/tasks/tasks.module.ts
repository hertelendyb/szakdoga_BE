import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment';
import { Log } from 'src/entities/log';
import { Project } from 'src/entities/project';
import { Task } from 'src/entities/task';
import { User } from 'src/entities/user';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { UserProjectRole } from 'src/entities/user_project_role';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Task,
      User,
      UserOrganizationRole,
      UserProjectRole,
      Comment,
      Log,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
