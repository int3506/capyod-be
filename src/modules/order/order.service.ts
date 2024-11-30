import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/modules/order/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { BlueprintService } from '../blueprint/blueprint.service';
import { Shipping } from '../shipping/entity/shipping.entity';

@Injectable()
export class OrderService {
  constructor (
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly blueprintService: BlueprintService,
  ) {}

  async createOrder(userId: number, orderData: CreateOrderDto): Promise<Order> {
    const { productId, blueprintId, quantity, address } = orderData;

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const blueprint = await this.blueprintService.findBlueprintById(blueprintId);
    if (!blueprint) {
      throw new NotFoundException('Blueprint not found.');
    }

    const totalPrice = product.price * quantity;
    const orderDate = new Date();

    const shipping = this.shippingRepository.create({ address });
    const savedShipping = await this.shippingRepository.save(shipping);
    const order = this.orderRepository.create({
      user,
      product,
      blueprint,
      shipping: savedShipping,
      quantity,
      totalPrice,
      orderDate,
    })
    const savedOrder = await this.orderRepository.save(order);
    await this.shippingRepository.update(savedShipping.id, { order: savedOrder });

    return savedOrder;
  }

  async findOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    const user = await this.userService.findUserById(userId);
    return await this.orderRepository.find({
      where: { user },
      relations: ['product', 'blueprint', 'shipping'],
    });
  }

  async findOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'product', 'blueprint', 'shipping'],
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async deleteOrder(userId: number, orderId: number): Promise<DeleteResult> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
    });

    if (!order) {
      throw new NotFoundException('Order does not exist or does not belong to this user.');
    }

    return await this.orderRepository.delete(orderId);
  }
}
