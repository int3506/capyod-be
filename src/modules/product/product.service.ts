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

  async createProduct(productData: CreateProductDto, imageUrl: string): Promise<Product> {
    const product = this.productRepository.create({
      ...productData,
      imageUrl: imageUrl,
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

  async deleteProduct(id: number): Promise<DeleteResult> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const path = join(process.cwd(), product.imageUrl);
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }

    return await this.productRepository.delete(id);
  }
}
