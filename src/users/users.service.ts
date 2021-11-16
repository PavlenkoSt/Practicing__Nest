import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[] | undefined> {
    return await this.userModel.find().exec();
  }

  async getOne(name: string): Promise<User | undefined> {
    return await this.userModel.findOne({ name });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async edit(userId: string, userDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: userId }, userDto);
  }

  async delete(id) {
    return await this.userModel.findOneAndDelete({ _id: id });
  }
}
