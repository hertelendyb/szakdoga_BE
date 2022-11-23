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
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/entities/user';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddContributor } from './dtos/add-contributor.dto';
import { AddProjectOwner } from './dtos/add-projectOwner.dto';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('api/organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('/')
  async listOrganizations(@Session() session: any) {
    return this.organizationsService.getMyOrganizations(
      session.passport.user.id,
    );
  }

  @Roles(1, 2, 3)
  @Get('/:id')
  async loadOrganization(
    @Session() session: any,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.organizationsService.loadOrganization(
      session.passport.user.id,
      orgId,
    );
  }

  @Roles(1)
  @Post('/:id/add-project-owner/')
  async addProjectOwnerToOrg(
    @Body() body: AddProjectOwner,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.organizationsService.addUserToOrg(body.email, orgId, 2);
  }

  @Roles(1)
  @Post('/:id/add-contributor/')
  async addContributorToOrg(
    @Body() body: AddContributor,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.organizationsService.addUserToOrg(body.email, orgId, 3);
  }

  @Roles(1)
  @Get('/:id/list-users')
  async listOrgUsers(@Param('id', ParseIntPipe) orgId: number) {
    return this.organizationsService.listOrgUsers(orgId);
  }

  @Roles(1)
  @Delete('/:id/remove-user')
  async removeUserFromOrg(
    @Body() body: Partial<User>,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.organizationsService.removeUserFromOrg(body.id, orgId);
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
      session.passport.user.id,
      organization,
    );

    return organization;
  }

  @Roles(1)
  @Delete('/:id')
  async deleteOrganization(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.deleteOrganization(id);
  }
}
