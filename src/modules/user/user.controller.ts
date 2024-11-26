import { Controller, Post, Body, Get, Patch, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(@Body() userData: CreateUserDto) {
    return await this.userService.createUser(userData, false);
  }

  @Post('partner')
  async createPartner(@Body() userData: CreateUserDto) {
    return await this.userService.createUser(userData, true);
  }

  @Get()
  async getUsers() {
    return await this.userService.findUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(+id);
  }

  @Get('find/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(+id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(+id);
  }
}
