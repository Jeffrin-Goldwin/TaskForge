import { Controller, Headers, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private user: UserService) {}

  @Get('me')
  getMe(@Headers('authorization') auth: string) {
    return this.user.getMe(auth);
  }

  @Post()
  create(@Body() body: { authUserId: string; email: string; name: string }) {
    return this.user.createProfile(body.authUserId, body.email, body.name);
  }
}
