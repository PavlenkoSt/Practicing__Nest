import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @MinLength(5, { message: 'Title must be 5 char and more' })
  title: string;

  @ApiProperty()
  @MinLength(5, { message: 'Description must be 5 char and more' })
  description: string;
}
