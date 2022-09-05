import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task';
import { User } from './user';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
  author: User;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  task: Task;
}
