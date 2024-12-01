import { Controller, Body, Get, Patch, Param, ParseIntPipe, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestService } from 'src/shared/request.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users ' })
  async getUsers() {
    return await this.userService.findUsers();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'User retrieves their profile' })
  @ApiBearerAuth()
  async getUserInfo() {
    try {
      const userId = this.requestService.getUserId();
      return await this.userService.findUserById(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile of a specific user' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(+id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get profile of a specific user by their email' })
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  async updateUser(
    @Body() userData: UpdateUserDto,
  ) {
    try {
      const userId = this.requestService.getUserId();
      return await this.userService.updateUser(userId, userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async updateUserForAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, userData);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  @ApiBearerAuth()
  async deleteUser() {
    const userId = this.requestService.getUserId();
    await this.userService.deleteUser(userId);
  }

  @Delete(':id')
  async deleteUserForAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
