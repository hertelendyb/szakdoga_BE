import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization';
import { Project } from 'src/entities/project';
import { User } from 'src/entities/user';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { UserProjectRole } from 'src/entities/user_project_role';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      Organization,
      UserProjectRole,
      UserOrganizationRole,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProjectsService],
  exports: [UsersService],
})
export class UsersModule {}
