import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization';
import { Role } from './role';
import { User } from './user';

@Entity()
@Index(['userId', 'organizationId'], { unique: true })
export class UserOrganizationRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  roleId!: number;

  @Column()
  organizationId!: number;

  @ManyToOne(() => User, (user) => user.userOrganizationRole)
  user!: User;

  @ManyToOne(() => Role, (role) => role.userOrganizationRole)
  role!: Role;

  @ManyToOne(
    () => Organization,
    (organization) => organization.userOrganizationRole,
  )
  organization!: Organization;
}
