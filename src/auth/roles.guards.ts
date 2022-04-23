import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
         private readonly jwtService: JwtService,
         private readonly reflector: Reflector
        ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if(!requiredRoles) {
                return true
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1]
            if(!token) {
                throw new UnauthorizedException({ message: 'User not authorized'})
            }
            const user = this.jwtService.verify(token)
            req.user = user
            return user.role.some((role: { value: string }) => requiredRoles.includes(role.value));
        } catch (e) {
            throw new HttpException('Not access', HttpStatus.FORBIDDEN)
        }
    }
}