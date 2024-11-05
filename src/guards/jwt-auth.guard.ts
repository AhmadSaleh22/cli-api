import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        console.log('Auth Guard Error:', err);
        console.log('Auth Guard User:', user);
        console.log('Auth Guard Info:', info);

        if (err) {
            throw err;
        }
        
        if (!user) {
            throw new UnauthorizedException('Authentication failed: ' + (info?.message || 'Invalid token'));
        }
        
        return user;
    }
} 