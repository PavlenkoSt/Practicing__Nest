import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly password: string;
}