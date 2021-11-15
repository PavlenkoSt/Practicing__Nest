import UserRole from 'src/types/UserRole';

export class CreateUserDto {
  readonly name: string;
  readonly password: string;
  readonly role: UserRole;
}
