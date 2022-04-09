import { IsEmail } from 'class-validator';

export class AddProjectOwner {
  @IsEmail()
  email: string;
}
