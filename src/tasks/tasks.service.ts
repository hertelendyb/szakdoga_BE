import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project';
import { Task } from 'src/entities/task';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async createTask(
    name: string,
    description: string,
    deadline: Date,
    projectId: number,
  ) {
    const project = await this.projectRepo.findOne({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = this.taskRepo.create({ name, description, deadline });
    task.project = project;
    return this.taskRepo.save(task);
  }
}
