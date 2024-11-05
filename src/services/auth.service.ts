import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { LoginResponseDto } from 'src/types/Responses/login.dto';
import { compare, hash } from 'bcrypt';
import { comparePasswords } from 'src/utils/passwords.security';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

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

    private invalidatedTokens: Set<string> = new Set();

    async logout(token: string) {
        // Extract the token from "Bearer token"
        const actualToken = token.split(' ')[1];
        
        // Add the token to invalidated tokens set
        this.invalidatedTokens.add(actualToken);
        
        return { message: 'Logout successful' };
    }

    isTokenInvalid(token: string): boolean {
        return this.invalidatedTokens.has(token);
    }
}
