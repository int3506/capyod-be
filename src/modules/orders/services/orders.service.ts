import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { Shipping } from 'src/entities/shipping.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CalculateShippingDto } from '../dto/calculate-shipping.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
  ) {}

  async getOrders(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['items', 'shipping', 'customer'] });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'shipping', 'customer'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items, shipping, totalPrice } = createOrderDto;

    // Tạo Shipping
    const newShipping = this.shippingRepository.create({
      address: shipping.address,
      status: 'in transit',
    });
    await this.shippingRepository.save(newShipping);

    // Tạo Order
    const order = this.orderRepository.create({
      totalPrice,
      customer: { id: customerId }, // Tham chiếu tới khách hàng
      shipping: newShipping,
    });
    await this.orderRepository.save(order);

    // Tạo các OrderItem
    const orderItems = items.map((item) =>
      this.orderItemRepository.create({ ...item, order }),
    );
    await this.orderItemRepository.save(orderItems);

    return await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['customer', 'items', 'shipping'],
    });
  }

  async sendOrderToProduction(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    order.status = 'in_production';
    await this.orderRepository.save(order);
  }

  async calculateShipping(calculateShippingDto: CalculateShippingDto): Promise<any> {
    const baseCost = 50;
    const weightFactor = 5;
    const totalWeight = calculateShippingDto.quantity * 1;

    return {
      shippingCost: baseCost + totalWeight * weightFactor,
      details: calculateShippingDto,
    };
  }
}