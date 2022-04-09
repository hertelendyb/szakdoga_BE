import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddProjectOwner } from './dtos/add-projectOwner.dto';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationsService } from './organizations.service';

interface sess {
  userId: number;
  orgId: number;
}

@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('/')
  async listOrganizations(@Session() session: any) {
    const myOrganizations = await this.organizationsService.getMyOrganizations(
      session.userId,
    );
    return myOrganizations;
  }

  @Get('/:id')
  async loadOrganization(
    @Session() session: any,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    const org = await this.organizationsService.loadOrganization(
      session.userId,
      orgId,
    );
    session.orgId = orgId;
    console.log(session);
    return org;
  }

  @Post('/:id')
  async addProjectOwnerToOrg(
    @Body() body: AddProjectOwner,
    @Session() session: any,
  ) {
    const projectOwner = await this.organizationsService.addProjectOwnerToOrg(
      body.email,
      session.orgId,
    );
    return projectOwner;
  }

  @Post('/create')
  async createOrganization(
    @Body() body: CreateOrganizationDto,
    @Session() session: any,
  ) {
    const organization = await this.organizationsService.createNewOrg(
      body.name,
    );

    await this.organizationsService.createConnection(
      session.userId,
      organization,
    );

    return organization;
  }
}
