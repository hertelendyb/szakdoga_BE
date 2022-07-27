import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { UserProjectRole } from 'src/entities/user_project_role';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserOrganizationRole)
    private orgPermissions: Repository<UserOrganizationRole>,
    @InjectRepository(UserProjectRole)
    private projectPermissions: Repository<UserProjectRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    const userId = context.switchToHttp().getRequest().user.id;
    const organizationId = context.switchToHttp().getRequest().params.id;
    const projectId = context.switchToHttp().getRequest().params.projectId;

    if (!roles) {
      return true;
    }

    for (const roleId of roles) {
      const havePermissonInOrg = await this.orgPermissions.findOne({
        where: { userId, organizationId, roleId },
      });

      const havePermissonInProject = await this.projectPermissions.findOne({
        where: { userId, projectId, roleId },
      });

      if (!!havePermissonInProject || !!havePermissonInOrg) {
        return true;
      }
    }
  }
}
