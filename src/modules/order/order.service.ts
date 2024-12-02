import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/modules/order/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { OrderItemService } from '../order-item/order-item.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor (
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly orderItemService: OrderItemService,
  ) {}

  async createOrder(userId: number, orderData: CreateOrderDto): Promise<Order> {
    const { orderItemId, quantity, address } = orderData;

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const orderItem = await this.orderItemService.findOrderItemById(orderItemId);
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found.');
    }

    const totalPrice = orderItem.price * quantity;
    const orderDate = new Date();

    const order = this.orderRepository.create({
      totalPrice,
      orderDate,
      quantity,
      address,
      user,
      orderItem,
    })

    return await this.orderRepository.save(order);
  }

  async findOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    const user = await this.userService.findUserById(userId);
    return await this.orderRepository.find({
      where: { user },
      relations: ['user', 'orderItem'],
    });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItem'],
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async updateOrder(id: number, orderData: UpdateOrderDto): Promise<UpdateResult> {
    const order = await this.orderRepository.findOneBy({ id });
    
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return await this.orderRepository.update(id, { status: orderData.status });
  }

  async deleteOrder(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id },
    })

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    await this.orderRepository.remove(order);

    return {
      message: 'Delete order successfully'
    };
  }
}
