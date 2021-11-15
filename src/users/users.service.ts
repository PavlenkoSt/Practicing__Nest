import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async getOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async getAll(): Promise<User[] | undefined> {
    return this.users;
  }

  create(userDto): User {
    this.users.push(userDto);
    return userDto;
  }

  delete(id) {
    this.users = this.users.filter((user) => user.userId !== id);
    return 'deleted'
  }
}
