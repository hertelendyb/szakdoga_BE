import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project';
import { Task } from 'src/entities/task';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createTask(
    name: string,
    description: string,
    deadline: Date,
    assigneeId: number,
    projectId: number,
  ) {
    const project = await this.projectRepo.findOne({ id: projectId });
    const assignee = assigneeId
      ? await this.userRepo.findOne({ id: assigneeId })
      : null;

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (assignee === undefined) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepo.create({
      name,
      description,
      deadline,
      project,
      assignee,
    });
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
      relations: ['project', 'parentTask', 'childTasks', 'assignee'],
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

  async deleteTask(taskId: number) {
    const task = await this.taskRepo.findOne({ id: taskId });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepo.delete({ id: taskId });
  }
}
