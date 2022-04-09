import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(
    email: string,
    password: string,
    name: string,
    profilePicture: string,
  ) {
    const user = this.repo.create({ email, password, name, profilePicture });

    return this.repo.save(user);
  }

  find(email: string) {
    return this.repo.find({ email });
  }
}
