import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<User[] | undefined> {
    try {
      return await this.userModel.find().exec();
    } catch (e) {
      console.log(e);
    }
  }

  async getOne(name: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ name });
    } catch (e) {
      console.log(e);
    }
  }

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      const { password } = userDto;

      const hash = await bcrypt.hash(password, 10);

      const createdUser = await this.userModel.create({
        ...userDto,
        password: hash,
      });
      return createdUser.save();
    } catch (e) {
      console.log(e);
    }
  }

  async edit(userId: string, userDto: UpdateUserDto) {
    try {
      const { password } = userDto;
      const newFields = Object.assign(userDto);

      if (password) {
        const hash = await bcrypt.hash(password, 10);
        newFields.password = hash;
      }

      return await this.userModel.updateOne({ _id: userId }, newFields);
    } catch (e) {
      console.log(e);
    }
  }

  async delete(id) {
    try {
      return await this.userModel.findOneAndDelete({ _id: id });
    } catch (e) {
      console.log(e);
    }
  }
}
