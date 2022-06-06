import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  deadline: Date;

  @IsOptional()
  @IsNumber()
  assigneeId: number;
}
