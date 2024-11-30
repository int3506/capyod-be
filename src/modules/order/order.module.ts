import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { RequestService } from 'src/shared/request.service';
import { UserModule } from '../user/user.module';
import { BlueprintModule } from '../blueprint/blueprint.module';
import { ProductModule } from '../product/product.module';
import { ShippingModule } from '../shipping/shipping.module';
import { Shipping } from '../shipping/entity/shipping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Shipping]),
    UserModule,
    BlueprintModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, RequestService],
})
export class OrderModule {}
