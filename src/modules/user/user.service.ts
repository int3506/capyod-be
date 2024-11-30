import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({...userData});
    return await this.userRepository.save(user);
  }

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) 
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }});

    if (!user) 
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    
    return await this.userRepository.update(id, {...userData});
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return await this.userRepository.delete(id);
  }
}
