import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(userData: CreateUserDto, isPartner: boolean) {
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

  async findUsers() {
    return await this.userRepository.find();
  }

  async findUserById(id: number) {
    // const user = await this.userRepository.findOneBy({ id });
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { blueprints: true },
    });

    if (!user) 
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }});

    if (!user) 
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    return user;
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    return await this.userRepository.update({id}, {...userData});
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete({id});
  }

  async validateUser(userData: LoginUserDto) {
    const {email, password} = userData;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    if (user.password != password)
      throw new UnauthorizedException('Incorrect password.')

    return user;
  }
}
