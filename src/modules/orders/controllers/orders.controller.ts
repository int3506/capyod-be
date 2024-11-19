import { Controller, Get, Post, Param, Body, HttpCode } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CalculateShippingDto } from '../dto/calculate-shipping.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Post(':id/send_to_production')
  @HttpCode(204)
  async sendToProduction(@Param('id') id: number) {
    await this.ordersService.sendOrderToProduction(id);
  }

  @Post('shipping')
  async calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.ordersService.calculateShipping(calculateShippingDto);
  }
}