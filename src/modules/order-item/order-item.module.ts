import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entity/order-item.entity';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { RequestService } from 'src/shared/request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    UserModule,
    ProductModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService, RequestService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
