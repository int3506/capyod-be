import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/entity/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    productData: CreateProductDto,
    frontsideImageUrl: string,
    backsideImageUrl: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...productData,
      frontsideImageUrl,
      backsideImageUrl,
    })
    return await this.productRepository.save(product);
  }

  async findProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: number, productData: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.productRepository.update(id, productData);
  }

  async deleteProduct(id: number): Promise<any> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);

    const frontsidePath = join(process.cwd(), product.frontsideImageUrl);
    if (fs.existsSync(frontsidePath)) fs.unlinkSync(frontsidePath);
    const backsidePath = join(process.cwd(), product.backsideImageUrl);
    if (fs.existsSync(backsidePath)) fs.unlinkSync(backsidePath);

    return {
      message: 'Delete product successfully',
    };
  }
}
