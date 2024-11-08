import { Controller, Post, Body, Headers, UseGuards, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginResponseDto } from 'src/types/Responses/login.dto';
import { AuthService } from 'src/services/auth.service';
import { ForgotPasswordDto } from 'src/auth/dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginResponseDto) {
        return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        // return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user and invalidate token' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    async logout(
        @Headers('authorization') token: string
    ) {
        if (!token) {
            throw new UnauthorizedException('No authorization token provided');
        }

        try {
            return await this.authService.logout(token);
        } catch (error) {
            throw new UnauthorizedException(error.message || 'Logout failed');
        }
    }
}
