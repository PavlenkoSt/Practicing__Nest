import { Role } from 'src/types/role.enum';

export class CreateUserDto {
  readonly name: string;
  readonly password: string;
  readonly role: Role[];
}
