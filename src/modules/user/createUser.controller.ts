import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './createUser.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Endpoint: /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
