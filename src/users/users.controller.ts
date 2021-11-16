import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Condition } from 'mongoose';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthUser } from 'src/auth/guards/auth-user.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':username')
  async getOneUser(@Param('username') username: string) {
    return this.usersService.getOne(username);
  }

  @Roles(Role.Admin)
  @Post()
  @ApiBody({ type: CreateUserDto })
  async createNewUser(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Roles(Role.Admin, Role.User)
  @Post('my-profile')
  @ApiBody({ type: UpdateUserDto })
  async editSelf(
    @AuthUser('userId') userId: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.edit(userId, userDto);
  }

  @Roles(Role.Admin)
  @Post(':id')
  @ApiBody({ type: UpdateUserDto })
  async editUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return this.usersService.edit(id, userDto);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('my-profile')
  async deleteSelf(@AuthUser('userId') userId: Condition<User>) {
    await this.postsService.deleteAllByAuthor(userId);
    return this.usersService.delete(userId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteuser(@Param('id') id: Condition<User>) {
    await this.postsService.deleteAllByAuthor(id);
    return this.usersService.delete(id);
  }
}
