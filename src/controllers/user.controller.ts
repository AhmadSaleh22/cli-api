import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from 'src/types';

@Controller('user')
export class UserController {
  @Get()
  getUser() {
    return 'user';
  }

  @Post()
  createUser(@Body() body: User) {
    return body;
  }
}
