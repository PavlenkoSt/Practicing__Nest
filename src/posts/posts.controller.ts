import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Condition } from 'mongoose';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './../users/schemas/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { AuthUser } from 'src/auth/guards/auth-user.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('posts')
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all posts',
  })
  getAllPosts() {
    return this.postsService.getAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get('my-posts')
  @ApiResponse({
    status: 200,
    description: 'Get all posts by auth author',
  })
  getAllMyPosts(@AuthUser('userId') userId: Condition<User>) {
    return this.postsService.getAllByAuthorId(userId);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get one posts by id',
  })
  getOneById(@Param('id') id: string) {
    return this.postsService.getOneById(id);
  }

  @Roles(Role.Admin, Role.User)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create posts',
  })
  @ApiBody({ type: CreatePostDto })
  createPost(@AuthUser('userId') userId, @Body() postDto: CreatePostDto) {
    return this.postsService.create({ ...postDto, authorId: userId });
  }

  @Roles(Role.Admin, Role.User)
  @Post('my-posts/:id')
  @ApiResponse({
    status: 200,
    description: 'Edit post by auth author',
  })
  @ApiBody({ type: UpdatePostDto })
  editMyPost(
    @AuthUser('userId') userId: Condition<User>,
    @Param('id') postId,
    @Body() postDto: UpdatePostDto,
  ) {
    return this.postsService.editMyPost(userId, postId, postDto);
  }

  @Roles(Role.Admin)
  @Post(':id')
  @ApiResponse({
    status: 200,
    description: 'Edit post (admin)',
  })
  @ApiBody({ type: UpdatePostDto })
  editPost(@Param('id') postId, @Body() postDto: UpdatePostDto) {
    return this.postsService.edit(postId, postDto);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('my-posts/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete post by auth author',
  })
  deleteOneMyPost(
    @AuthUser('userId') userId: Condition<User>,
    @Param('id') id: string,
  ) {
    return this.postsService.deleteOneMy(userId, id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete post (admin)',
  })
  deleteOnePost(@Param('id') id: string) {
    return this.postsService.deleteOne(id);
  }
}
