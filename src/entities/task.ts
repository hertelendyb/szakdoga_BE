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

  @Column({ default: null })
  order: number;

  @Column('date')
  deadline: Date;

  @Column({ type: 'boolean', default: false })
  done: boolean;

  @ManyToOne(() => Task, (task) => task.childTasks, { onDelete: 'CASCADE' })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  childTasks: Task[];

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks)
  assignee: User;
}
