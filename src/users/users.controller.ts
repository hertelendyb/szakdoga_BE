import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {}

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

  @Get('/me')
  async me(@Session() session: any) {
    if (!session.passport) {
      throw new UnauthorizedException();
    }
    return this.usersService.me(session.passport.user.id);
  }

  @Get('/myProjects')
  async getMyProjects(@Session() session: any) {
    return this.projectsService.listMyProjects(session.passport.user.id);
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
