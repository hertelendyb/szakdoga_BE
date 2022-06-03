import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization';
import { Task } from './task';
import { UserProjectRole } from './user_project_role';

@Entity()
@Index(['name', 'organization'], { unique: true })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(
    () => UserProjectRole,
    (userProjectRole) => userProjectRole.project,
  )
  userProjectRole: UserProjectRole[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
