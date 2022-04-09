import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    email: string,
    password: string,
    name: string,
    profilePicture: string,
  ) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email already exists');
    }

    //Hash the password
    //Generate salt
    const salt = randomBytes(8).toString('hex');
    //Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join the hash result and the salt
    const result = salt + '.' + hash.toString('hex');
    //Create new user and save
    const user = await this.usersService.create(
      email,
      result,
      name,
      profilePicture,
    );
    //Return the user
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException('Wrong password');
    }

    return user;
  }
}
