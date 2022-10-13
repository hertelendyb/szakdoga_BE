import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment';
import { Log } from './log';
import { Project } from './project';
import { User } from './user';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  order: number;

  @Column({ type: 'date', default: null })
  deadline: Date;

  @Column({ type: 'boolean', default: false })
  done: boolean;

  @ManyToOne(() => Task, (task) => task.childTasks, { onDelete: 'CASCADE' })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  childTasks: Task[];

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'SET NULL' })
  assignee: User;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => Log, (log) => log.task)
  logs: Log[];
}
