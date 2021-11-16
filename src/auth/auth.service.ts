import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.getOne(username);

      const isMatch = await bcrypt.compare(pass, user.password);

      if (user && isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  }

  async login(loginData: any) {
    try {
      const { username, password } = loginData;

      const userDoc = await this.validateUser(username, password);
      const user = userDoc._doc;

      const payload = { name: user.name, sub: user._id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      console.log(e);
    }
  }
}
