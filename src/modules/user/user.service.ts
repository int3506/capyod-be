import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(userData: CreateUserDto, isPartner: boolean): Promise<User> {
    const email = userData.email;
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (user)
      throw new HttpException('email must be unique.', HttpStatus.BAD_REQUEST);

    const newUser = this.userRepository.create({
      ...userData,
      isPartner: isPartner
    })
    return await this.userRepository.save(newUser);
  }

  async findUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    // const user = await this.userRepository.findOneBy({ id });
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { blueprints: true },
    });

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
    return await this.userRepository.update({id}, {...userData});
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({id});
  }
}
