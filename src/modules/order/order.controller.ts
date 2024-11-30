import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestService } from 'src/shared/request.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'User creates an order and App automatically creates shipping' })
  async createOrder(@Body() orderData: CreateOrderDto) {
    try {
      const userId = this.requestService.getUserId();
      return await this.orderService.createOrder(userId, orderData);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getOrders() {
    return await this.orderService.findOrders();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all orders of a specific user' })
  async getOrdersByUserId(@Param('id', ParseIntPipe) userId: number) {
    try {
      return await this.orderService.findOrdersByUserId(userId);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Partner retrieves all orders' })
  async getOrdersOwner() {
    try {
      const userId = this.requestService.getUserId();
      return await this.orderService.findOrdersByUserId(userId);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.orderService.findOrderById(+id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeOrder(@Param('id', ParseIntPipe) id: number) {
    try {
      const userId = this.requestService.getUserId();
      return await this.orderService.deleteOrder(userId, +id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
