import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
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
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { message: 'Invalid credentials', access_token: null, user: null };
        }
        return this.authService.login(user);
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
