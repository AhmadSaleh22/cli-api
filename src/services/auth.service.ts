import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginResponseDto } from 'src/types/Responses/login.dto';
import { compare, hash } from 'bcrypt';
import { comparePasswords } from 'src/utils/passwords.security';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
        // Clean up invalid tokens periodically (every hour)
        setInterval(() => this.cleanupInvalidatedTokens(), 3600000);
    }

    async login(loginDto: LoginResponseDto) {
        console.log('Login attempt with:', loginDto);

        const user = await this.usersService.findByUsername(loginDto.username);
        console.log('Found user:', user);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        console.log('Comparing passwords:');
        console.log('Input loginDto.password:', loginDto.password);
 
        // Directly compare the raw password with the stored hash
        const isPasswordValid = await comparePasswords(loginDto.password, user.password);

        console.log('Password valid:', isPasswordValid);
        console.log(" --- hashed password", await hash(loginDto.password, 10))
        console.log(' ---- Stored hash:', user.password);
        console.log(" --- valid password ",  await hash(loginDto.password, 10) === user.password )

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id };
        return {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                access_token: this.jwtService.sign(payload),
            },
        };
    }

    private invalidatedTokens: Map<string, number> = new Map(); // Store token with expiry timestamp

    async logout(token: string) {
        try {
            if (!token) {
                throw new UnauthorizedException('No token provided');
            }

            // Extract the token from "Bearer token"
            const actualToken = token.replace('Bearer ', '');

            // Verify the token is valid before invalidating
            const decoded = await this.jwtService.verify(actualToken);

            // Store token with expiration timestamp
            const expiryTimestamp = decoded.exp * 1000; // Convert to milliseconds
            this.invalidatedTokens.set(actualToken, expiryTimestamp);

            return { 
                success: true,
                message: 'Logout successful' 
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    // Method to check if a token is invalidated (blacklisted)
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
