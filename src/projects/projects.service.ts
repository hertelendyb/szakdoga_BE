import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization';
import { Project } from 'src/entities/project';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
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

  async getMyProjects(orgId: number) {
    if (!orgId) {
      throw new NotFoundException(
        'Organization not found. Please load an organization.',
      );
    }
    const projects = await this.projectRepo.find({
      relations: ['organization'],
    });

    const result = projects.filter(
      (project) => project.organization.id === orgId,
    );

    return result;
  }
}