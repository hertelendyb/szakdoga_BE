import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project';
import { Role } from './role';
import { User } from './user';

@Entity()
export class UserProjectRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId!: number;

  @Column()
  roleId!: number;

  @Column()
  projectId!: number;

  @ManyToOne(() => User, (user) => user.userProjectRole)
  user!: User;

  @ManyToOne(() => Role, (role) => role.userProjectRole)
  role!: Role;

  @ManyToOne(() => Project, (project) => project.userProjectRole)
  project!: Project;
}
