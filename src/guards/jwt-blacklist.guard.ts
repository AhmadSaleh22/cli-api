import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtBlacklistGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (this.authService.isTokenInvalidated(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    return true;
  }
} 