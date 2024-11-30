import { Controller, Body, Get, Patch, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/role.enum';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get profile of a specific user' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(+id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'User retrieves their profile' })
  async getUserInfo() {
    const userId = this.requestService.getUserId();
    return await this.userService.findUserById(userId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get profile of a specific user by their email' })
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateUserForAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.userService.updateUser(+id, userData);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateUser(
    @Body() userData: UpdateUserDto,
  ) {
    const userId = this.requestService.getUserId();
    return await this.userService.updateUser(userId, userData);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUserForAdmin(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(+id);
  }

  @UseGuards(AuthGuard)
  @Delete('me')
  async deleteUser() {
    const userId = this.requestService.getUserId();
    await this.userService.deleteUser(userId);
  }
}
