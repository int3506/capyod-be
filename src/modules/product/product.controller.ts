import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductDtoWithFile } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { ...multerConfig, ...multerOptions }))
  @ApiOperation({ summary: 'Admin uploads a new shirt type' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDtoWithFile })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    if (!file) {
      throw new HttpException('File is invalid or not sent.', HttpStatus.BAD_REQUEST);
    }
    const imageUrl = `/uploads/images/${file.filename}`;
    return await this.productService.createProduct(productData, imageUrl);
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
