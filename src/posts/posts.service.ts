import { CreatePostDto } from './dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Condition, FilterQuery, Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAll() {
    return await this.postModel.find().exec();
  }

  async getOneById(id: string) {
    return await this.postModel.findById(id);
  }

  async create(postDto: CreatePostDto) {
    const newPost = new this.postModel(postDto);
    return newPost.save();
  }

  async deleteOne(id: string) {
    return await this.postModel.findOneAndDelete({ _id: id });
  }

  async deleteAllByAuthor(authorId: Condition<User>) {
    return await this.postModel.deleteMany({ authorId });
  }
}
