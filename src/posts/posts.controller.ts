import { Condition } from 'mongoose';
import { User } from './../users/schemas/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  CreatePostDto,
  CreatePostDtoWithoutAuthor,
} from './dto/create-post.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/types/role.enum';
import { AuthUser } from 'src/auth/guards/auth-user.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  getAllPosts() {
    return this.postsService.getAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get('my-posts')
  getAllMyPosts(@AuthUser('userId') userId: string) {
    return this.postsService.getAllByAuthorId(userId);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  getOneById(@Param('id') id: string) {
    return this.postsService.getOneById(id);
  }

  @Roles(Role.Admin, Role.User)
  @Post()
  createPost(
    @AuthUser('userId') userId,
    @Body() postDto: CreatePostDtoWithoutAuthor,
  ) {
    return this.postsService.create({ ...postDto, authorId: userId });
  }

  @Roles(Role.Admin, Role.User)
  @Post('my-posts/:id')
  editMyPost(
    @AuthUser('userId') userId: Condition<User>,
    @Param('id') postId,
    @Body() postDto: UpdatePostDto,
  ) {
    return this.postsService.editMyPost(userId, postId, postDto);
  }

  @Roles(Role.Admin)
  @Post(':id')
  editPost(@Param('id') postId, @Body() postDto: UpdatePostDto) {
    return this.postsService.edit(postId, postDto);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('my-posts/:id')
  deleteOneMyPost(
    @AuthUser('userId') userId: Condition<User>,
    @Param('id') id: string,
  ) {
    return this.postsService.deleteOneMy(userId, id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  deleteOnePost(@Param('id') id: string) {
    return this.postsService.deleteOne(id);
  }
}
