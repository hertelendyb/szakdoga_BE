import { IsEmail } from 'class-validator';

export class AddContributor {
  @IsEmail()
  email: string;
}
