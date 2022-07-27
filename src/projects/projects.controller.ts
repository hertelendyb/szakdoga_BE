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
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('organizations/:id/projects')
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
    return this.projectsService.getMyProjects(orgId);
  }

  @Roles(1, 2)
  @Get('/:projectId')
  async listOneProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getProject(projectId);
  }

  @Roles(1, 2)
  @Delete('/:projectId')
  async deleteProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.deleteProject(projectId);
  }
}
