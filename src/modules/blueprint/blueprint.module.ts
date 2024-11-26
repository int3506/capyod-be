import { Module } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { BlueprintController } from './blueprint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blueprint } from 'src/entities/blueprint.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from '../user/user.module';
import { RequestService } from 'src/shared/request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blueprint, User]),
    UserModule,
  ],
  controllers: [BlueprintController],
  providers: [BlueprintService, RequestService],
})
export class BlueprintModule {}
