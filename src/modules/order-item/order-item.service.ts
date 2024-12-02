import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entity/order-item.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async createOrderItem(
    userId: number,
    orderItemData: CreateOrderItemDto,
    frontsideImageUrl?: string,
    backsideImageUrl?: string,
  ): Promise<OrderItem> {
    const { productId } = orderItemData;

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    let price = +product.price;
    price += frontsideImageUrl ? 10000: 0;
    price += backsideImageUrl ? 10000: 0;

    const orderItem = this.orderItemRepository.create({
      price,
      user,
      product,
      frontsideImageUrl,
      backsideImageUrl,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  async findOrderItems(): Promise<OrderItem[]> {
    return await this.orderItemRepository.find();
  }

  async findOrderItemsByUserId(userId: number): Promise<OrderItem[]> {
    const user = await this.userService.findUserById(userId);
    return await this.orderItemRepository.find({
      where: { user },
      relations: ['product'],
    });
  }

  async findOrderItemById(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!orderItem) {
      throw new NotFoundException('OrderItem not found.');
    }

    return orderItem;
  }

  async deleteOrderItem(userId: number, orderId: number): Promise<any> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!orderItem) {
      throw new NotFoundException('OrderItem does not exist or does not belong to this user.');
    }

    await this.orderItemRepository.remove(orderItem);

    if (orderItem.frontsideImageUrl) {
      const frontsidePath = join(process.cwd(), orderItem.frontsideImageUrl);
      if (fs.existsSync(frontsidePath)) fs.unlinkSync(frontsidePath);
    }
    if (orderItem.backsideImageUrl) {
      const backsidePath = join(process.cwd(), orderItem.backsideImageUrl);
      if (fs.existsSync(backsidePath)) fs.unlinkSync(backsidePath);
    }

    return {
      message: 'Delete orderItem successfully'
    };
  }
}
