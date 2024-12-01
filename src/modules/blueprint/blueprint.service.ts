import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blueprint } from 'src/modules/blueprint/entity/blueprint.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class BlueprintService {
  constructor(
    @InjectRepository(Blueprint)
    private readonly blueprintRepository: Repository<Blueprint>,
    private readonly userService: UserService,
  ) {}

  async createBlueprint(
    userId: number,
    blueprintData: CreateBlueprintDto,
    imageUrl: string,
  ): Promise<Blueprint> {
    const user = await this.userService.findUserById(userId);

    const blueprint = this.blueprintRepository.create({
      ...blueprintData,
      user: user,
      imageUrl: imageUrl,
    })

    return this.blueprintRepository.save(blueprint);
  }

  async findBlueprints(): Promise<Blueprint[]> {
    return await this.blueprintRepository.find();
  }

  async findBlueprintsByUserId(userId: number): Promise<Blueprint[]> {
    await this.userService.findUserById(userId);

    return await this.blueprintRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findBlueprintById(blueprintId: number): Promise<Blueprint> {
    const blueprint = await this.blueprintRepository.findOne({
      where: { id: blueprintId },
      relations: { user: true },
    })

    if (!blueprint) {
      throw new NotFoundException('Blueprint not found.');
    }

    return blueprint;
  }

  async updateBlueprint(userId: number, blueprintId: number, blueprintData: UpdateBlueprintDto): Promise<UpdateResult> {
    const blueprint = await this.blueprintRepository.findOne({
      where: { id: blueprintId, user: { id: userId } },
    });
    
    if (!blueprint) {
      throw new NotFoundException('Blueprint does not exist or does not belong to this user.');
    }
    return await this.blueprintRepository.update(blueprintId, blueprintData);
  }

  async deleteBlueprint(userId: number, blueprintId: number): Promise<DeleteResult> {
    const blueprint = await this.blueprintRepository.findOne({
      where: { id: blueprintId, user: { id: userId } },
    });
    
    if (!blueprint) {
      throw new NotFoundException('Blueprint does not exist or does not belong to this user.');
    }

    const path = join(process.cwd(), blueprint.imageUrl);
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }

    return await this.blueprintRepository.delete(blueprintId);
  }
}
