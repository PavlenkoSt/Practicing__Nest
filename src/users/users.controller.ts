import { Condition } from 'mongoose';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @Get(':username')
  async getOneUser(@Param('username') username: string) {
    return this.usersService.getOne(username);
  }

  @Post()
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  async deleteuser(@Param('id') id: Condition<User>) {
    await this.postsService.deleteAllByAuthor(id);
    return this.usersService.delete(id);
  }
}
