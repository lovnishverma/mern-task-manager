import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTagDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsOptional()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: 'Color must be a valid hex color code (e.g. #3B82F6)',
  })
  color?: string;
}
