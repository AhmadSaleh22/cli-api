import { Controller, Post, Body, Headers } from '@nestjs/common';
import { LoginResponseDto } from 'src/types/Responses/login.dto';
import { AuthService } from 'src/services/auth.service';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginResponseDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    logout(@Headers('authorization') token: string) {
        return this.authService.logout(token);
    }
}
