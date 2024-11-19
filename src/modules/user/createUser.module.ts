import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from 'src/entities/partner.entity';
import { Customer} from 'src/entities/customer.entity';
import { UserService } from './createUser.service';
import { UserController } from './createUser.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Partner])], // Khai báo Entity User
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class CreateUserModule {}
