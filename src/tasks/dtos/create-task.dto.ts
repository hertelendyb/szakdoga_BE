import { IsDate, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  deadline: Date;
}
