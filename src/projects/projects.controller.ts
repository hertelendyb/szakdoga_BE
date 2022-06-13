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
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthenticatedGuard)
@Controller('organizations/:id/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/create')
  async createProject(
    @Body() body: CreateProjectDto,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.projectsService.create(body.name, orgId);
  }

  @Get('/')
  async listProjects(@Param('id', ParseIntPipe) orgId: number) {
    return this.projectsService.getMyProjects(orgId);
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
