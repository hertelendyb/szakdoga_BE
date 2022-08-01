import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrganizationRole } from './user_organization_role';
import { UserProjectRole } from './user_project_role';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.role,
  )
  userOrganizationRole: UserOrganizationRole[];

  @OneToMany(() => UserProjectRole, (userProjectRole) => userProjectRole.role)
  userProjectRole: UserProjectRole[];
}
