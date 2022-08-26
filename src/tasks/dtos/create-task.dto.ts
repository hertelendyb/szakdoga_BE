import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  done: boolean;

  @IsOptional()
  @IsNumber()
  order: number;
}
