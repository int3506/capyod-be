import {Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { RequestService } from 'src/shared/request.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { AuthGuard } from '../auth/auth.guard';

@Controller('blueprints')
@UseGuards(AuthGuard) 
export class BlueprintController {
  constructor(
    private readonly blueprintService: BlueprintService,
    private readonly requestService: RequestService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { ...multerConfig, ...multerOptions }))
  async createBlueprint(
    @UploadedFile() file: Express.Multer.File,
    @Body() blueprintData: CreateBlueprintDto,
  ) {
    try {
      if (!file) {
        throw new HttpException('File is invalid or not sent.', HttpStatus.BAD_REQUEST);
      }
      const userId = this.requestService.getUserId();
      const imageUrl = `/uploads/images/${file.filename}`;
      return await this.blueprintService.createBlueprint(userId, blueprintData, imageUrl);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getBlueprints() {
    return await this.blueprintService.findBlueprints();
  }

  @Get('user')
  async getBlueprintsByUser() {
    try {
      const userId = this.requestService.getUserId();
      return await this.blueprintService.findBlueprintsByUser(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getBlueprintById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.blueprintService.findBlueprintById(+id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async updateBlueprint(@Param('id', ParseIntPipe) id: number, @Body() blueprintData: UpdateBlueprintDto) {
    try {
      const userId = this.requestService.getUserId();
      return await this.blueprintService.updateBlueprint(userId, +id, blueprintData);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async removeBlueprint(@Param('id', ParseIntPipe) id: number) {
    try {
      const userId = this.requestService.getUserId();
      return await this.blueprintService.deleteBlueprint(userId, +id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
