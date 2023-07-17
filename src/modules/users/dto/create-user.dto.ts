import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

import { Role } from 'src/types/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(5, { message: 'Name must be 5 char and more' })
  readonly name: string;

  @ApiProperty()
  @MinLength(5, { message: 'Password must be 5 char and more' })
  readonly password: string;

  @ApiProperty()
  readonly role: Role;
}
