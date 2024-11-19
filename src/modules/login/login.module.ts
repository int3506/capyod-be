import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Customer } from '../../entities/customer.entity';
import { Partner} from '../../entities/partner.entity';
import { UserService } from '../user/createUser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Partner]), // Import User Entity
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with a secure key
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, UserService, JwtAuthGuard],
  exports: [LoginService, UserService, JwtModule],
})
export class LoginModule {}
