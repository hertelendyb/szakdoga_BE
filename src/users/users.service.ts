import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

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

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

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
}
