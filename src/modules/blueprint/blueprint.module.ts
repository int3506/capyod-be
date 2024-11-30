import { Module } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { BlueprintController } from './blueprint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blueprint } from 'src/modules/blueprint/entity/blueprint.entity';
import { UserModule } from '../user/user.module';
import { RequestService } from 'src/shared/request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blueprint]),
    UserModule,
  ],
  controllers: [BlueprintController],
  providers: [BlueprintService, RequestService],
  exports: [BlueprintService],
})
export class BlueprintModule {}
