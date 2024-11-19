import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/entities/customer.entity';
import {Partner} from 'src/entities/partner.entity'
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Customer)
    private readonly CustomerRepository: Repository<Customer>,
    @InjectRepository(Partner)
    private readonly PartnerRepository: Repository<Partner>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ customer: Customer; partner: Partner }> {
    const { name, email, password, phoneNumber } = createUserDto;

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo đối tượng user từ DTO
    const customer = this.CustomerRepository.create({
      name,
      email,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      phoneNumber,
    });
    const savedCustomer = await this.CustomerRepository.save(customer);

     const partner = this.PartnerRepository.create({
      id: savedCustomer.id,
      name,
      email,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      phoneNumber,
    });
    const savedPartner = await this.PartnerRepository.save(partner);

    return {
      customer: savedCustomer,
      partner: savedPartner,
    };
  }

  async validateUser(email: string, password: string): Promise<Customer | null> {
    const user = await this.CustomerRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    return user;
  }
}
