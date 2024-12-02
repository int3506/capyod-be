import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RequestService } from 'src/shared/request.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'User creates an order of an OrderItem' })
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

  @Patch(':id')
  @ApiOperation({ summary: 'Admin updates the new orderStatus' })
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() orderData: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(id, orderData);
  }

  @Delete(':id')
  async removeOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.deleteOrder(id);
  }
}
