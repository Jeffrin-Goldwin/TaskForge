import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body) {
    return this.auth.login(body.email, body.password);
  }

  @Get('health')
  health() {
    return 'Auth OK';
  }
}
