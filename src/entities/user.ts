import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment';
import { Task } from './task';
import { UserOrganizationRole } from './user_organization_role';
import { UserProjectRole } from './user_project_role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name: string;

  @Column({ type: 'blob', nullable: true })
  profilePicture: string;

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.user,
  )
  userOrganizationRole: UserOrganizationRole[];

  @OneToMany(() => UserProjectRole, (userProjectRole) => userProjectRole.user)
  userProjectRole: UserProjectRole[];

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
