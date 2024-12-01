import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  async createOrder(@Body() orderData: CreateOrderDto) {
    const userId = this.requestService.getUserId();
    return await this.orderService.createOrder(userId, orderData);
  }

  @Get()
  async getOrders() {
    return await this.orderService.findOrders();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all orders of a specific user' })
  async getOrdersByUserId(@Param('id', ParseIntPipe) userId: number) {
    return await this.orderService.findOrdersByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Partner retrieves all orders' })
  @ApiBearerAuth()
  async getOrdersOwner() {
    const userId = this.requestService.getUserId();
    return await this.orderService.findOrdersByUserId(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findOrderById(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async removeOrder(@Param('id', ParseIntPipe) id: number) {
    const userId = this.requestService.getUserId();
    return await this.orderService.deleteOrder(userId, id);
  }
}
