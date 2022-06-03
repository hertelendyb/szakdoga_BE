import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddProjectOwner } from 'src/organizations/dtos/add-projectOwner.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthGuard)
@Controller('organizations/:id/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/create')
  async createProject(
    @Body() body: CreateProjectDto,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    const project = await this.projectsService.create(body.name, orgId);
    return project;
  }

  @Get('/')
  async listProjects(@Param('id', ParseIntPipe) orgId: number) {
    const myProjects = await this.projectsService.getMyProjects(orgId);
    return myProjects;
  }

  @Get('/:projectId')
  async listOneProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getProject(projectId);
  }

  @Delete('/:projectId')
  async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.deleteProject(projectId);
  }

  // @Post('/:id')
  // async addProjectOwnerToOrg(
  //   @Body() body: AddProjectOwner,
  //   @Session() session: any,
  // ) {
  //   const projectOwner = await this.organizationsService.addProjectOwnerToOrg(
  //     body.email,
  //     session.orgId,
  //   );
  //   return projectOwner;
  // }
}
