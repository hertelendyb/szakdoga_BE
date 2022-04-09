import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project';
import { User } from './user';
import { UserOrganizationRole } from './user_organization_role';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.organization,
  )
  userOrganizationRole: UserOrganizationRole[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];
}
