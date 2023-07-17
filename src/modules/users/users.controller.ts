import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Condition } from 'mongoose';

import { ValidationPipe } from 'src/pipes/validation.pipe';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthUser } from 'src/guards/auth-user.guard';
import { Roles } from 'src/decorators/roles.decorator';

import { Role } from 'src/types/role.enum';
import { User } from './schemas/user.schema';
import { PostsService } from '../posts/posts.service';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':username')
  @ApiResponse({
    status: 200,
    description: 'Get user by username',
  })
  async getOneUser(@Param('username') username: string) {
    return this.usersService.getOne(username);
  }

  @Roles(Role.Admin)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create user (admin)',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation problem',
  })
  @ApiBody({ type: CreateUserDto })
  async createNewUser(@Body(new ValidationPipe()) userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Roles(Role.Admin, Role.User)
  @Post('my-profile')
  @ApiResponse({
    status: 200,
    description: 'Update self user profile',
  })
  @ApiBody({ type: UpdateUserDto })
  async editSelf(
    @AuthUser('userId') userId: string,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.usersService.edit(userId, userDto);
  }

  @Roles(Role.Admin)
  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Update user (admin)',
  })
  @ApiBody({ type: CreateUserDto })
  async editUser(@Param('id') id: string, @Body() userDto: CreateUserDto) {
    return this.usersService.edit(id, userDto);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('my-profile')
  @ApiResponse({
    status: 200,
    description: 'Delete self profile',
  })
  async deleteSelf(@AuthUser('userId') userId: Condition<User>) {
    await this.postsService.deleteAllByAuthor(userId);
    return this.usersService.delete(userId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete profile (admin)',
  })
  async deleteuser(@Param('id') id: Condition<User>) {
    await this.postsService.deleteAllByAuthor(id);
    return this.usersService.delete(id);
  }
}
