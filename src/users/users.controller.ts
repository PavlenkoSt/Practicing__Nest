import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ValidationPipe } from './../pipes/validation.pipe';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
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
