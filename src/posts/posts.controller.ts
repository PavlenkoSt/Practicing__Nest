import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAll();
  }

  @Get(':id')
  getOneById(@Param('id') id: string) {
    return this.postsService.getOneById(id);
  }

  @Post()
  createPost(@Body() postDto: CreatePostDto) {
    return this.postsService.create(postDto);
  }

  @Post(':id')
  editPost(@Param('id') postId, @Body() postDto: UpdatePostDto) {
    return this.postsService.edit(postId, postDto);
  }

  @Delete(':id')
  deleteOnePost(@Param('id') id: string) {
    return this.postsService.deleteOne(id);
  }
}
