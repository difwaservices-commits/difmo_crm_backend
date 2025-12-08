import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    @Post('login')
    async login(@Body() req) {
        console.log('Login attempt for:', req.email);
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            console.log('Invalid credentials for:', req.email);
            throw new UnauthorizedException('Invalid credentials');
        }
        console.log('User validated, generating token for:', user.id);
        const result = await this.authService.login(user);
        console.log('Login result:', JSON.stringify(result));
        return result;
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        // req.user contains { userId, username } from JwtStrategy
        return this.userService.findById(req.user.userId);
    }
}
