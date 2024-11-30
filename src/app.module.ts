import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blueprint } from "./modules/blueprint/entity/blueprint.entity";
import { Product } from "./modules/product/entity/product.entity";
import { Order } from "./modules/order/entity/order.entity";
import { Shipping } from "./modules/shipping/entity/shipping.entity";
import { AppController } from "./app.controller";
import { UserModule}  from "./modules/user/user.module";
import { BlueprintModule } from './modules/blueprint/blueprint.module';
import { AuthenticationMiddleware } from "./shared/middlewares/authentication.middleware";
import { RequestService } from "./shared/request.service";
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { User } from "./modules/user/entity/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Blueprint,
      Product,
      Order,
      User,
      Shipping,
    ]),
    
    UserModule,
    BlueprintModule,
    AuthModule,
    ProductModule,
    OrderModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
