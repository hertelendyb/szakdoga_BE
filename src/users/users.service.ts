import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProjectRole } from 'src/entities/user_project_role';
import { UserOrganizationRole } from 'src/entities/user_organization_role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(UserProjectRole)
    private userProjectRoleRepo: Repository<UserProjectRole>,
    @InjectRepository(UserOrganizationRole)
    private userOrganizationRoleRepo: Repository<UserOrganizationRole>,
  ) {}

  async signup(
    email: string,
    password: string,
    name: string,
    profilePicture: string,
  ) {
    const users = await this.repo.find({ email });

    if (users.length) {
      throw new BadRequestException('email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.repo.create({
      email,
      password: hashedPassword,
      name,
      profilePicture,
    });

    return this.repo.save(user);
  }

  async getUser(email: string) {
    return this.repo.findOne({ email });
  }

  async deleteUser(userId: number) {
    return this.repo.delete({ id: userId });
  }

  async me(userId: number) {
    const user = await this.repo.findOne({ id: userId });
    const orgPermissions = await this.userOrganizationRoleRepo.find({ userId });
    const projectPermissions = await this.userProjectRoleRepo.find({ userId });
    return {
      user: { ...user },
      orgPermissions,
      projectPermissions,
    };
  }
}
