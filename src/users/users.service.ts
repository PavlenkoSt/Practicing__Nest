import { User, UserDocument } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[] | undefined> {
    return this.userModel.find().exec();
  }

  async getOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async create(userDto): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async delete(id) {
    return await this.userModel.findOneAndDelete({ id });
  }
}
