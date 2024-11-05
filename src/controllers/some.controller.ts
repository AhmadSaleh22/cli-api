import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtBlacklistGuard } from '../guards/jwt-blacklist.guard';

@Controller('some')
export class SomeController {
  @UseGuards(JwtAuthGuard, JwtBlacklistGuard)
  @Get()
  async someProtectedRoute() {
    // ... your route logic
  }
} 