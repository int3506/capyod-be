import { Injectable, NotFoundException } from '@nestjs/common';
import { Shipping } from 'src/modules/shipping/entity/shipping.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ShippingStatus } from './models/shipping-status.enum';
import { Order } from '../order/entity/order.entity';
import { UpdateShippingDto } from './dto/update-shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
  ) {}

  async findShippings(): Promise<Shipping[]> {
    return await this.shippingRepository.find();
  }

  async findShippingById(id: number): Promise<Shipping> {
    const shipping = await this.shippingRepository.findOne({ 
      where: { id },
      relations: ['order'],
    });

    if (!shipping) {
      throw new NotFoundException('Shipping not found.');
    }

    return shipping;
  }

  async updateShipping(id: number, shippingData: UpdateShippingDto): Promise<UpdateResult> {
    const shipping = await this.shippingRepository.findOneBy({ id });
    
    if (!shipping) {
      throw new NotFoundException('Shipping not found.');
    }

    return await this.shippingRepository.update(id, { status: shippingData.status });
  }
}
