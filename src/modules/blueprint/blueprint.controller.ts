import {Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { CreateBlueprintDto, CreateBlueprintDtoWithFile } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { RequestService } from 'src/shared/request.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Blueprint')
@Controller('blueprints')
export class BlueprintController {
  constructor(
    private readonly blueprintService: BlueprintService,
    private readonly requestService: RequestService,
  ) {}

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { ...multerConfig, ...multerOptions }))
  @ApiOperation({ summary: 'Partner uploads a new blueprint' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBlueprintDtoWithFile })
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

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all blueprints of a specific user' })
  async getBlueprintsByUserId(@Param('id', ParseIntPipe) userId: number) {
    try {
      return await this.blueprintService.findBlueprintsByUserId(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
  @Get('me')
  @ApiOperation({ summary: 'Partner retrieves all blueprints' })
  async getBlueprintsOwner() {
    try {
      const userId = this.requestService.getUserId();
      return await this.blueprintService.findBlueprintsByUserId(userId);
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

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
  @Patch(':id')
  async updateBlueprint(@Param('id', ParseIntPipe) id: number, @Body() blueprintData: UpdateBlueprintDto) {
    try {
      const userId = this.requestService.getUserId();
      return await this.blueprintService.updateBlueprint(userId, +id, blueprintData);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
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
