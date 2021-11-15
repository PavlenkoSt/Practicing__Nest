import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    // private readonly jwtService: JwtService,
  ) {}

  async validateUser(username, password) {
    const user = await this.usersService.getOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // login(user): { accessToken: string } {
  //   const payload = {
  //     username: user.username,
  //     id: user.id,
  //   };

  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   };
  // }
}
