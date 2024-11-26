import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blueprint } from "./entities/blueprint.entity";
import { Product } from "./entities/product.entity";
import { OrderItem } from "./entities/orderItem.entity";
import { Order } from "./entities/order.entity";
import { Shipping } from "./entities/shipping.entity";
import { AppController } from "./app.controller";
import { UserModule}  from "./modules/user/user.module";
import { User } from "./entities/user.entity";
import { BlueprintModule } from './modules/blueprint/blueprint.module';
import { AuthenticationMiddleware } from "./shared/middlewares/authentication.middleware";
import { RequestService } from "./shared/request.service";
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Blueprint,
      Product,
      OrderItem,
      Order,
      User,
      Shipping,
    ]),
    
    UserModule,
    BlueprintModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
