import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  // Store invalidated tokens with their expiry time
  private invalidatedTokens: Map<string, number> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Clean up expired tokens every hour
    setInterval(() => this.cleanupInvalidatedTokens(), 3600000);
  }

  async generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async logout(bearerToken: string) {
    try {
      // Remove 'Bearer ' prefix
      const token = bearerToken.replace('Bearer ', '');
      
      // Verify token is valid before blacklisting
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Store token with its expiration time
      this.invalidatedTokens.set(token, decoded.exp * 1000);

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Method to check if a token is blacklisted
  isTokenInvalidated(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }

  private cleanupInvalidatedTokens() {
    const now = Date.now();
    for (const [token, expiry] of this.invalidatedTokens.entries()) {
      if (expiry < now) {
        this.invalidatedTokens.delete(token);
      }
    }
  }
} 