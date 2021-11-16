import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/types/role.enum';

export class CreateUserDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly role: Role;
}
