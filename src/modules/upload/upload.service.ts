import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blueprint } from "../../entities/blueprint.entity";
import { User } from "../../entities/user.entity";
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Blueprint)
    private readonly blueprintRepository: Repository<Blueprint>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  
  async saveBlueprint(uploadImageDto: UploadImageDto, imageUrl: string, userId: number) {
    // Kiểm tra Partner tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Partner không tồn tại với userId được cung cấp');
    }

    // Lưu Blueprint liên kết với Partner
    const blueprint = this.blueprintRepository.create({
      name: uploadImageDto.name,
      description: uploadImageDto.description,
      imageUrl,
      user,
    });

    return await this.blueprintRepository.save(blueprint);
  }
  
}
