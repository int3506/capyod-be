import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/createUser.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Xác thực người dùng
    const user = await this.userService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo token JWT
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Trả về token và thông tin người dùng
    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }
}
