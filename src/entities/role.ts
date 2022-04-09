import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Function } from './function';
import { UserOrganizationRole } from './user_organization_role';
import { UserProjectRole } from './user_project_role';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Function)
  @JoinTable()
  functions: Function[];

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.role,
  )
  userOrganizationRole: UserOrganizationRole[];

  @OneToMany(() => UserProjectRole, (userProjectRole) => userProjectRole.role)
  userProjectRole: UserProjectRole[];
}
