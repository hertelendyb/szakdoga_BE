import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization';
import { Project } from 'src/entities/project';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { UserProjectRole } from 'src/entities/user_project_role';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProjectRole,
      UserOrganizationRole,
      Project,
      Organization,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
