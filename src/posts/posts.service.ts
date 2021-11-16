import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Condition, Model } from 'mongoose';

import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAll() {
    try {
      return await this.postModel.find().exec();
    } catch (e) {
      console.log(e);
    }
  }

  async getAllByAuthorId(authorId: Condition<User>) {
    try {
      return await this.postModel.find({ authorId });
    } catch (e) {
      console.log(e);
    }
  }

  async getOneById(id: string) {
    try {
      return await this.postModel.findById(id);
    } catch (e) {
      console.log(e);
    }
  }

  async create(postDto: CreatePostDto & { authorId: string }) {
    try {
      if (!postDto.title || !postDto.description || !postDto.authorId) {
        throw new Error('Need title, description and authorId');
      }

      const newPost = await this.postModel.create(postDto);
      return newPost.save();
    } catch (e) {
      console.log(e);
    }
  }

  async edit(postId: string, postDto: UpdatePostDto) {
    try {
      return await this.postModel.updateOne({ _id: postId }, postDto);
    } catch (e) {
      console.log(e);
    }
  }

  async editMyPost(
    authorId: Condition<User>,
    postId: string,
    postDto: UpdatePostDto,
  ) {
    try {
      return await this.postModel.updateOne({ _id: postId, authorId }, postDto);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteOne(id: string) {
    try {
      return await this.postModel.findOneAndDelete({ _id: id });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteOneMy(authorId: Condition<User>, id: string) {
    try {
      return await this.postModel.findOneAndDelete({ authorId, _id: id });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAllByAuthor(authorId: Condition<User>) {
    try {
      return await this.postModel.deleteMany({ authorId });
    } catch (e) {
      console.log(e);
    }
  }
}
