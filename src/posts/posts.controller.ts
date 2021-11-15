import { CreatePostDto } from './dto/create-post.dto';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
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

  @Delete(':id')
  deleteOnePost(@Param('id') id: string) {
    return this.postsService.deleteOne(id);
  }
}
