import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Condition } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

  @Post(':id')
  async editUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.usersService.edit(id, userDto);
  }

  @Delete(':id')
  async deleteuser(@Param('id') id: Condition<User>) {
    await this.postsService.deleteAllByAuthor(id);
    return this.usersService.delete(id);
  }
}
