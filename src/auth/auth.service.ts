import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(email);
    const passwordValid = user
      ? await bcrypt.compare(password, user.password)
      : null;
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
