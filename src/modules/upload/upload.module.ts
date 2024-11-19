import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blueprint } from "../../entities/blueprint.entity";
import { Partner } from "../../entities/partner.entity";
import { LoginModule } from '../login/login.module'; // Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Blueprint, Partner]), 
    LoginModule,   
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
