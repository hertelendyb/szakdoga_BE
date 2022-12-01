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
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private authService: AuthService,
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
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Request() req) {
    return this.usersService.me(req.user.id);
  }

  @Get('/myProjects')
  async getMyProjects(@Request() req) {
    return this.projectsService.listMyProjects(req.user.id);
  }

  // @Get('/logout')
  // logout(@Request() req) {
  //   req.session.destroy();
  //   return { msg: 'The user session has ended' };
  // }

  @Delete('/delete')
  async deleteUser(@Request() req) {
    return this.usersService.deleteUser(req.user.id);
  }
}
