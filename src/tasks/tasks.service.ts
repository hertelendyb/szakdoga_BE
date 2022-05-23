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

  async createSubTask(
    name: string,
    description: string,
    deadline: Date,
    taskId: number,
  ) {
    const parent = await this.taskRepo.findOne({ id: taskId });

    if (!parent) {
      throw new NotFoundException('Parent task not found');
    }

    const task = this.taskRepo.create({ name, description, deadline });
    task.parentTask = parent;
    return this.taskRepo.save(task);
  }

  async listTasks(projectId: number) {
    const project = await this.projectRepo.findOne({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const tasks = await this.taskRepo.find({
      relations: ['project', 'parentTask', 'childTasks'],
    });

    return tasks.filter((task) =>
      task.project ? task.project.id === projectId : null,
    );
  }

  async listOneTask(taskId: number) {
    const task = await this.taskRepo.findOne({ id: taskId });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['parentTask', 'childTasks'],
    });
  }
}
