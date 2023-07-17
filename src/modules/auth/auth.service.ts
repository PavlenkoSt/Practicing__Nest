import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Role } from 'src/types/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.getOne(name);

      if (!user) {
        throw new HttpException(
          'Uncorrect name or password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      return e;
    }
  }

  async login(loginData: any) {
    try {
      const { name, password } = loginData;

      const userDoc = await this.validateUser(name, password);

      if (userDoc) {
        const user = userDoc._doc;

        return this.generateToken(user.name, user._id, user.role);
      }

      throw new HttpException(
        'Incorrect name or password',
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      return e;
    }
  }

  async registration(registerData: any) {
    try {
      const { name } = registerData;

      const candidate = await this.usersService.getOne(name);

      if (candidate) {
        throw new HttpException(
          'this name already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user: any = await this.usersService.create({
        ...registerData,
        role: Role.User,
      });

      return this.generateToken(user.name, user._id, user.role);
    } catch (e) {
      return e;
    }
  }

  generateToken(name, _id, role) {
    const payload = { name, _id, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
