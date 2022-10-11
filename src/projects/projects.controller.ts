import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/entities/user';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddContributor } from 'src/organizations/dtos/add-contributor.dto';
import { AddProjectOwner } from 'src/organizations/dtos/add-projectOwner.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('api/organizations/:id/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Roles(1)
  @Post('/create')
  async createProject(
    @Body() body: CreateProjectDto,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.projectsService.create(body.name, orgId);
  }

  @Roles(1)
  @Get('/')
  async listProjects(@Param('id', ParseIntPipe) orgId: number) {
    return this.projectsService.getProjects(orgId);
  }

  @Roles(1, 2, 3)
  @Get('/:projectId')
  async listOneProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getProject(projectId);
  }

  @Roles(1, 2)
  @Post('/:projectId/add-project-owner/')
  async addProjectOwnerToProject(
    @Body() body: AddProjectOwner,
    @Param('id', ParseIntPipe) orgId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.addUserToProject(
      body.email,
      orgId,
      projectId,
      2,
    );
  }

  @Roles(1, 2)
  @Post('/:projectId/add-contributor/')
  async addContributorToProject(
    @Body() body: AddContributor,
    @Param('id', ParseIntPipe) orgId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.addUserToProject(
      body.email,
      orgId,
      projectId,
      3,
    );
  }

  @Roles(1, 2)
  @Delete('/:projectId/remove-user')
  async removeUserFromProject(
    @Body() body: Partial<User>,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.removeUserFromProject(body.id, projectId);
  }

  @Roles(1, 2, 3)
  @Get('/:projectId/contributors/')
  async listContributors(
    @Param('id', ParseIntPipe) orgId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.listContributors(orgId, projectId);
  }

  @Roles(1, 2)
  @Delete('/:projectId')
  async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.deleteProject(projectId);
  }
}
