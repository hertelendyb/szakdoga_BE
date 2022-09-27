import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization';
import { Project } from 'src/entities/project';
import { User } from 'src/entities/user';
import { UserOrganizationRole } from 'src/entities/user_organization_role';
import { UserProjectRole } from 'src/entities/user_project_role';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserProjectRole)
    private userProjectRoleRepo: Repository<UserProjectRole>,
    @InjectRepository(UserOrganizationRole)
    private userOrganizationRoleRepo: Repository<UserOrganizationRole>,
  ) {}

  async create(name: string, orgId: number) {
    const org = await this.orgRepo.findOne({ id: orgId });
    const notUnique = await this.projectRepo.findOne({
      name: name,
      organization: org,
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    if (notUnique) {
      throw new ForbiddenException(
        'A project with the same name already exists.',
      );
    }

    const project = this.projectRepo.create({ name });
    project.organization = org;
    return this.projectRepo.save(project);
  }

  async getProjects(orgId: number) {
    if (!orgId) {
      throw new NotFoundException(
        'Organization not found. Please load an organization.',
      );
    }
    const projects = await this.projectRepo.find({
      relations: ['organization'],
    });

    return projects.filter((project) => project.organization.id === orgId);
  }

  async listMyProjects(id: number) {
    const connections = await this.userProjectRoleRepo.find({ userId: id });
    const projectIDs = connections.map((connection) => connection.projectId);
    if (projectIDs.length > 0) {
      return this.projectRepo.findByIds(projectIDs);
    } else {
      return 'No projects found';
    }
  }

  async getProject(projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['tasks'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async addUserToProject(
    email: string,
    orgId: number,
    projectId: number,
    roleId: number,
  ) {
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const projectConnection = await this.userProjectRoleRepo.findOne({
      userId: user.id,
      projectId,
    });
    const organizationConnection = await this.userOrganizationRoleRepo.findOne({
      userId: user.id,
      organizationId: orgId,
    });

    if (projectConnection || organizationConnection) {
      throw new ForbiddenException(
        'This user is already member of the organization or the project',
      );
    }

    const newUser = this.userProjectRoleRepo.create({
      userId: user.id,
      projectId,
      roleId,
    });
    return this.userProjectRoleRepo.save(newUser);
  }

  async removeUserFromProject(userId: number, projectId: number) {
    return this.userProjectRoleRepo.delete({ userId, projectId });
  }

  async listContributors(organizationId: number, projectId: number) {
    const orgContributors = await this.userOrganizationRoleRepo.find({
      where: {
        organizationId,
        roleId: 3,
      },
    });

    const projectContributors = await this.userProjectRoleRepo.find({
      where: {
        projectId,
        roleId: 3,
      },
    });

    return [...orgContributors, ...projectContributors];
  }

  async deleteProject(projectId: number) {
    const project = await this.projectRepo.findOne({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.projectRepo.delete({ id: projectId });
  }
}
