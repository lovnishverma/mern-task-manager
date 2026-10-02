import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskStatus, TaskPriority } from '../enums/task.enums';

export class UpdateTaskDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: TODO, IN_PROGRESS, DONE',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Priority must be one of: LOW, MEDIUM, HIGH',
  })
  priority?: TaskPriority;

  @IsOptional()
  @IsISO8601({}, { message: 'DueDate must be a valid ISO 8601 date string' })
  dueDate?: string;

  @IsOptional()
  @IsArray({ message: 'tagIds must be an array' })
  @IsUUID('4', { each: true, message: 'Each tag ID must be a valid UUID' })
  tagIds?: string[];
}
