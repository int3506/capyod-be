import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blueprint } from "./entities/blueprint.entity";
import { Product } from "./entities/product.entity";
import { OrderItem } from "./entities/orderItem.entity";
import { Order } from "./entities/order.entity";
import { Partner } from "./entities/partner.entity";
import { Customer } from "./entities/customer.entity";
import { Shipping } from "./entities/shipping.entity";
import { UploadModule } from "./modules/upload/upload.module";
import { AppController } from "./app.controller";
import {CreateUserModule} from "./modules/user/createUser.module";
import { LoginModule } from "./modules/login/login.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Blueprint,
      Product,
      OrderItem,
      Order,
      Partner,
      Customer,
      Shipping,
    ]),
    UploadModule,
    CreateUserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
