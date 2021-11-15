import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    console.log(createUserDto);

    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  async deleteuser(@Param(':id') id: string) {
    return this.usersService.delete(+id);
  }
}
