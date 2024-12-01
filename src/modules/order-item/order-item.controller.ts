import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, ParseIntPipe } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto, CreateOrderItemDtoWithFiles } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestService } from 'src/shared/request.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';

@ApiTags('OrderItem')
@Controller('order-items')
export class OrderItemController {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly requestService: RequestService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'frontsideImage', maxCount: 1 },
    { name: 'backsideImage', maxCount: 1},
  ], { ...multerConfig, ...multerOptions }))
  @ApiOperation({ summary: 'User creates an order item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateOrderItemDtoWithFiles })
  @ApiBearerAuth()
  async createOrderItem(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() orderItemData: CreateOrderItemDto,
  ) {
    let frontsideImageUrl: string | null = null;
    let backsideImageUrl: string | null = null;

    if (files) {
      if (files.frontsideImage && files.frontsideImage.length > 0) {
        const frontsideFile = files.frontsideImage[0];
        frontsideImageUrl = `/uploads/images/${frontsideFile.filename}`;
      }
    
      if (files.backsideImage && files.backsideImage.length > 0) {
        const backsideFile = files.backsideImage[0];
        backsideImageUrl = `/uploads/images/${backsideFile.filename}`;
      }
    }

    const userId = this.requestService.getUserId();

    return await this.orderItemService.createOrderItem(userId, orderItemData, frontsideImageUrl, backsideImageUrl);
  }

  @Get()
  async getOrderItems() {
    return await this.orderItemService.findOrderItems();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all orderItems of a specific user' })
  async getOrderItemsByUserId(@Param('id', ParseIntPipe) userId: number) {
    return await this.orderItemService.findOrderItemsByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Users retrieves all orderItems' })
  @ApiBearerAuth()
  async getOrderItemsOwner() {
    const userId = this.requestService.getUserId();
    return await this.orderItemService.findOrderItemsByUserId(userId);
  }

  @Get(':id')
  async getOrderItemById(@Param('id', ParseIntPipe) id: number) {
    return await this.orderItemService.findOrderItemById(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async removeOrderItem(@Param('id', ParseIntPipe) id: number) {
    const userId = this.requestService.getUserId();
    return await this.orderItemService.deleteOrderItem(userId, id);
  }
}
