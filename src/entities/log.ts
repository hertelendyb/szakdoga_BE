import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Task, (task) => task.logs, { onDelete: 'CASCADE' })
  task: Task;
}
