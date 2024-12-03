import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not provided.');
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            request.user = payload; // Adiciona o usuário na requisição
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token.');
        }
    }
}