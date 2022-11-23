import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project';
import { Role } from './role';
import { User } from './user';

@Entity()
@Index(['userId', 'projectId'], { unique: true })
export class UserProjectRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId!: number;

  @Column()
  roleId!: number;

  @Column()
  projectId!: number;

  @ManyToOne(() => User, (user) => user.userProjectRole, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Role, (role) => role.userProjectRole)
  role!: Role;

  @ManyToOne(() => Project, (project) => project.userProjectRole, {
    onDelete: 'CASCADE',
  })
  project!: Project;
}
