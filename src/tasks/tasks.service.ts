import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment';
import { Log } from 'src/entities/log';
import { Project } from 'src/entities/project';
import { Task } from 'src/entities/task';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Log) private logRepo: Repository<Log>,
  ) {}

  async createTask(
    name: string,
    description: string,
    deadline: Date,
    assigneeId: number,
    order: number,
    projectId: number,
    user: User,
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
      order,
    });

    await this.taskRepo.save(task);

    const log = this.logRepo.create({
      text: `${user.name} created this task.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return task;
  }

  async createSubTask(
    name: string,
    description: string,
    deadline: Date,
    taskId: number,
    assigneeId: number,
    user: User,
  ) {
    const parent = await this.taskRepo.findOne({ id: taskId });
    const assignee = assigneeId
      ? await this.userRepo.findOne({ id: assigneeId })
      : null;

    if (!parent) {
      throw new NotFoundException('Parent task not found');
    }

    const task = this.taskRepo.create({
      name,
      description,
      deadline,
      assignee,
    });

    task.parentTask = parent;

    await this.taskRepo.save(task);

    const log = this.logRepo.create({
      text: `${user.name} created this task.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return task;
  }

  async editTask(taskId: number, user: User, data: Partial<CreateTaskDto>) {
    const task = await this.taskRepo.findOne({ id: taskId });

    const { name, description, deadline, assigneeId, done, order } = data;

    if (name) {
      task.name = name;
    }
    if (description) {
      task.description = description;
    }
    if (deadline) {
      task.deadline = deadline;
    }
    if (assigneeId) {
      task.assignee = await this.userRepo.findOne({ id: assigneeId });
    }
    if (done === false || done === true) {
      task.done = done;
    }
    if (order) {
      task.order = order;
    }

    await this.taskRepo.save(task);

    const log = this.logRepo.create({
      text: `${user.name} edited this task.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return task;
  }

  async moveTask(taskId: number, user: User, data: Partial<CreateTaskDto>) {
    const task = await this.taskRepo.findOne({ id: taskId });
    const { projectId } = data;
    const project = await this.projectRepo.findOne({ id: projectId });

    task.assignee = null;
    task.order = null;
    task.project = project;
    task.parentTask = null;

    await this.taskRepo.save(task);

    const log = this.logRepo.create({
      text: `${user.name} moved this task.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return task;
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
      relations: [
        'parentTask',
        'childTasks',
        'childTasks.childTasks',
        'comments',
        'comments.author',
        'assignee',
      ],
    });
  }

  async deleteTask(taskId: number) {
    const task = await this.taskRepo.findOne({ id: taskId });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepo.delete({ id: taskId });
  }

  async addComment(taskId: number, user: User, text: string) {
    const task = await this.taskRepo.findOne({ id: taskId });
    const author = await this.userRepo.findOne({ id: user.id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const log = this.logRepo.create({
      text: `${user.name} added a comment.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    const comment = this.commentRepo.create({
      text,
      createdAt: new Date(Date.now()),
      author,
      task,
    });

    return this.commentRepo.save(comment);
  }

  async deleteComment(taskId: number, commentId: number, user: User) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author'],
    });
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepo.delete({ id: commentId });

    const log = this.logRepo.create({
      text: `${user.name} deleted a comment.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return this.commentRepo.find({ where: { task: taskId } });
  }

  async editComment(
    taskId: number,
    commentId: number,
    user: User,
    text: string,
  ) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author'],
    });
    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.text = text;

    await this.commentRepo.save(comment);

    const log = this.logRepo.create({
      text: `${user.name} edited a comment.`,
      timestamp: new Date(Date.now()),
      task,
    });

    await this.logRepo.save(log);

    return this.commentRepo.find({ where: { task: taskId } });
  }

  async getLogs(taskId: number) {
    return this.logRepo.find({
      where: {
        task: taskId,
      },
    });
  }
}
