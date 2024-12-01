import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { RequestService } from 'src/shared/request.service';
import { UserModule } from '../user/user.module';
import { OrderItemModule } from '../order-item/order-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    OrderItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, RequestService],
})
export class OrderModule {}
