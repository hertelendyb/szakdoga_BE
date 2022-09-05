import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.signup(
      body.email,
      body.password,
      body.name,
      body.profilePicture,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @Delete('/delete')
  async deleteUser(@Session() session: any) {
    return this.usersService.deleteUser(session.passport.user.id);
  }
}
