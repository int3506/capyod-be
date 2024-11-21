import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blueprint } from "./entities/blueprint.entity";
import { Product } from "./entities/product.entity";
import { OrderItem } from "./entities/orderItem.entity";
import { Order } from "./entities/order.entity";
import { Shipping } from "./entities/shipping.entity";
import { UploadModule } from "./modules/upload/upload.module";
import { AppController } from "./app.controller";
import { UserModule}  from "./modules/user/user.module";
import { User } from "./entities/user.entity";

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
    UploadModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
