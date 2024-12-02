import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { Blueprint } from "./modules/blueprint/entity/blueprint.entity";
import { Product } from "./modules/product/entity/product.entity";
import { Order } from "./modules/order/entity/order.entity";
import { AppController } from "./app.controller";
import { UserModule}  from "./modules/user/user.module";
import { BlueprintModule } from './modules/blueprint/blueprint.module';
import { AuthenticationMiddleware } from "./shared/middlewares/authentication.middleware";
import { RequestService } from "./shared/request.service";
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { User } from "./modules/user/entity/user.entity";
import { APP_FILTER } from "@nestjs/core";
import { CatchEverythingFilter } from "./shared/filters/catch-everything.filter";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderItem } from "./modules/order-item/entity/order-item.entity";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Blueprint,
      Product,
      Order,
      User,
      OrderItem,
    ]),
    AuthModule,
    UserModule,
    BlueprintModule,
    ProductModule,
    OrderItemModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
      // useClass: HttpExceptionFilter,
    },
    RequestService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
