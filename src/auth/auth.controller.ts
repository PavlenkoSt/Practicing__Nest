import { ValidationPipe } from './../pipes/validation.pipe';
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login and return token',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body(new ValidationPipe()) loginFields: LoginDto) {
    return this.authService.login(loginFields);
  }

  @Post('registration')
  @ApiResponse({
    status: 200,
    description: 'Registration and return token',
  })
  @ApiBody({ type: LoginDto })
  async registration(@Body(new ValidationPipe()) registrationFields: LoginDto) {
    return this.authService.registration(registrationFields);
  }
}
