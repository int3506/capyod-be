import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post()
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    return this.loginService.login(email, password);
  }
}
