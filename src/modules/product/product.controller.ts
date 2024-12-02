import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpException, HttpStatus, ParseIntPipe, UseGuards, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductDtoWithFiles } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'frontsideImage', maxCount: 1 },
    { name: 'backsideImage', maxCount: 1},
  ], { ...multerConfig, ...multerOptions }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDtoWithFiles })
  async createProduct(
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() productData: CreateProductDto,
  ) {
    if (!files.frontsideImage || files.frontsideImage.length === 0) 
      throw new BadRequestException('Frontside of the shirt can not be emmty');
    if (!files.backsideImage || files.backsideImage.length === 0)
      throw new BadRequestException('Backside of the shirt can not be emmty');

    const frontsideImageUrl = `/uploads/images/${files.frontsideImage[0].filename}`;
    const backsideImageUrl = `/uploads/images/${files.backsideImage[0].filename}`;

    return await this.productService.createProduct(productData, frontsideImageUrl, backsideImageUrl);
  }

  @Get()
  async getProducts() {
    return await this.productService.findProducts();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findProductById(id);
  }

  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() productData: UpdateProductDto) {
    return await this.productService.updateProduct(id, productData);
  }

  @Delete(':id')
  async removeProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProduct(id);
  }
}
