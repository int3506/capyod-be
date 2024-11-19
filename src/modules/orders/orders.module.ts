import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { Shipping } from 'src/entities/shipping.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Shipping])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

