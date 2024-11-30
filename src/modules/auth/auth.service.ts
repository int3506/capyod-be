import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { DataSource } from 'typeorm';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    const email = userData.email;
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (user)
      throw new HttpException('email must be unique.', HttpStatus.BAD_REQUEST);

    return await this.userService.createUser(userData);
  }

  async login(account: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findUserByEmail(account.email);
    if (user?.password != account.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
