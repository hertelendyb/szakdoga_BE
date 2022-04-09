import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddProjectOwner } from 'src/organizations/dtos/add-projectOwner.dto';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/create')
  async createProject(@Body() body: CreateProjectDto, @Session() session: any) {
    const project = await this.projectsService.create(body.name, session.orgId);
    return project;
  }

  @Get('/')
  async listProjects(@Session() session: any) {
    const myProjects = await this.projectsService.getMyProjects(session.orgId);
    return myProjects;
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
