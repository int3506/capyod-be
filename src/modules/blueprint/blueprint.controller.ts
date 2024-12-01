import {Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { CreateBlueprintDto, CreateBlueprintDtoWithFile } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { RequestService } from 'src/shared/request.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  async createBlueprint(
    @UploadedFile() file: Express.Multer.File,
    @Body() blueprintData: CreateBlueprintDto,
  ) {
    if (!file) {
      throw new HttpException('File is invalid or not sent.', HttpStatus.BAD_REQUEST);
    }
    const userId = this.requestService.getUserId();
    const imageUrl = `/uploads/images/${file.filename}`;
    return await this.blueprintService.createBlueprint(userId, blueprintData, imageUrl);
  }

  @Get()
  async getBlueprints() {
    return await this.blueprintService.findBlueprints();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all blueprints of a specific user' })
  async getBlueprintsByUserId(@Param('id', ParseIntPipe) userId: number) {
    return await this.blueprintService.findBlueprintsByUserId(userId);
  }

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
  @Get('me')
  @ApiOperation({ summary: 'Partner retrieves all blueprints' })
  @ApiBearerAuth()
  async getBlueprintsOwner() {
    const userId = this.requestService.getUserId();
    return await this.blueprintService.findBlueprintsByUserId(userId);
  }

  @Get(':id')
  async getBlueprintById(@Param('id', ParseIntPipe) id: number) {
    return await this.blueprintService.findBlueprintById(id);
  }

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
  @Patch(':id')
  @ApiBearerAuth()
  async updateBlueprint(@Param('id', ParseIntPipe) id: number, @Body() blueprintData: UpdateBlueprintDto) {
    const userId = this.requestService.getUserId();
    return await this.blueprintService.updateBlueprint(userId, id, blueprintData);
  }

  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard, RolesGuard) 
  @Delete(':id')
  @ApiBearerAuth()
  async removeBlueprint(@Param('id', ParseIntPipe) id: number) {
    const userId = this.requestService.getUserId();
    return await this.blueprintService.deleteBlueprint(userId, id);
  }
}
