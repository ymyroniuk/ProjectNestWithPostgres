import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: CreateUserDto) {
        const candidate = await this.userService.getUser(dto.email)
        if(candidate) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await hash(dto.password, 13)
        const user = await this.userService.createUser({...dto, password: hashPassword})
        return this.generateToken(user);
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { id: user.id, email: user.email, role: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(dto: CreateUserDto) {
        const candidate = await this.userService.getUser(dto.email)
        const validatePassword = await compare(dto.password, candidate.password)
        if(candidate && validatePassword) {
            return candidate;
        }
        throw new UnauthorizedException({ message: 'Wrong email or password'});
    }
}
