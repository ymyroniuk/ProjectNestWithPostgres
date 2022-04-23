import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '../users/users.model';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Create user'})
    @ApiResponse({ status: 201, type: User })
    @Post('/register')
    register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }
    @ApiOperation({ summary: 'Create user'})
    @ApiResponse({ status: 201, type: User })
    @Post('/login')
    login(@Body() dto: CreateUserDto) {
        return this.authService.login(dto);
    }
}
