import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization';
import { Role } from 'src/entities/role';
import { User } from 'src/entities/user';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private repo: Repository<Organization>,
    @InjectRepository(UserOrganizationRole)
    private joinRepo: Repository<UserOrganizationRole>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createNewOrg(name: string) {
    const organization = this.repo.create({ name });

    return this.repo.save(organization);
  }

  async createConnection(id: number, organization: Organization) {
    const role = await this.roleRepo.findOne(1);
    const user = await this.userRepo.findOne(id);

    const join = this.joinRepo.create({ user, role, organization });
    this.joinRepo.save(join);
  }

  async getMyOrganizations(id: number) {
    const connections = await this.joinRepo.find({ userId: id });
    const orgIDs = connections.map((connection) => connection.organizationId);
    if (orgIDs.length > 0) {
      const myOrgs = await this.repo.findByIds(orgIDs);
      return myOrgs;
    } else {
      return 'No organizations found';
    }
  }

  async loadOrganization(userId: number, orgId: number) {
    const access = await this.joinRepo.findOne({
      userId: userId,
      organizationId: orgId,
    });
    if (!access) {
      throw new ForbiddenException('You have no access to this organization');
    } else {
      return this.repo.findOne({
        where: { id: orgId },
        relations: ['projects'],
      });
    }
  }

  async addProjectOwnerToOrg(email: string, orgId: number) {
    const user = await this.userRepo.findOne({ email: email });
    if (!orgId) {
      throw new NotFoundException(
        'No organization found. Must select one first.',
      );
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const connection = await this.joinRepo.findOne({
      userId: user.id,
      organizationId: orgId,
    });
    if (connection) {
      throw new ForbiddenException(
        'This user is already member of the organization',
      );
    }

    const newProjectOwner = this.joinRepo.create({
      userId: user.id,
      organizationId: orgId,
      roleId: 2,
    });
    return this.joinRepo.save(newProjectOwner);
  }

  async deleteOrganization(orgId: number) {
    const org = await this.repo.findOne({ id: orgId });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return this.repo.delete({ id: orgId });
  }
}
