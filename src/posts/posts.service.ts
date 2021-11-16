import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Condition, Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAll() {
    return await this.postModel.find().exec();
  }

  async getAllByAuthorId(authorId: string) {
    return await this.postModel.find({ authorId } as {
      authorId: Condition<User>;
    });
  }

  async getOneById(id: string) {
    return await this.postModel.findById(id);
  }

  async create(postDto: CreatePostDto) {
    const newPost = new this.postModel(postDto);
    return newPost.save();
  }

  async edit(postId: string, postDto: UpdatePostDto) {
    return this.postModel.updateOne({ _id: postId }, postDto);
  }

  async editMyPost(
    authorId: Condition<User>,
    postId: string,
    postDto: UpdatePostDto,
  ) {
    return this.postModel.updateOne({ _id: postId, authorId }, postDto);
  }

  async deleteOne(id: string) {
    return await this.postModel.findOneAndDelete({ _id: id });
  }

  async deleteOneMy(authorId: Condition<User>, id: string) {
    return await this.postModel.findOneAndDelete({ authorId, _id: id });
  }

  async deleteAllByAuthor(authorId: Condition<User>) {
    return await this.postModel.deleteMany({ authorId });
  }
}
