import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Token is missing');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Gắn thông tin người dùng vào request
      return true;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
