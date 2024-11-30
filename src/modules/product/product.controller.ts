import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductDtoWithFile } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/shared/helpers/multer.config';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/models/role.enum';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { ...multerConfig, ...multerOptions }))
  @ApiOperation({ summary: 'Admin uploads a new shirt type' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDtoWithFile })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    try {
      if (!file) {
        throw new HttpException('File is invalid or not sent.', HttpStatus.BAD_REQUEST);
      }
      const imageUrl = `/uploads/images/${file.filename}`;
      return await this.productService.createProduct(productData, imageUrl);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getProducts() {
    return await this.productService.findProducts();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.findProductById(+id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    try {
      return await this.productService.updateProduct(+id, productData);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    try {
      return await this.productService.deleteProduct(+id);
    } catch(error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
