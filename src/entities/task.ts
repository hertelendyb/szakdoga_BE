import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project';
import { User } from './user';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  order: number;

  @Column('date')
  deadline: Date;

  @ManyToOne(() => Task, (task) => task.childTasks)
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  childTasks: Task[];

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks)
  assignee: User;
}
