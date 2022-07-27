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
import { RolesGuard } from 'src/guards/roles.guard';
import { AddProjectOwner } from './dtos/add-projectOwner.dto';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('/')
  async listOrganizations(@Session() session: any) {
    return this.organizationsService.getMyOrganizations(
      session.passport.user.id,
    );
  }

  @Roles(1)
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
  @Post('/:id/addPo/')
  async addProjectOwnerToOrg(
    @Body() body: AddProjectOwner,
    @Param('id', ParseIntPipe) orgId: number,
  ) {
    return this.organizationsService.addProjectOwnerToOrg(body.email, orgId);
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
