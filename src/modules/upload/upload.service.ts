import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blueprint } from "../../entities/blueprint.entity";
import { Partner } from "../../entities/partner.entity";
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Blueprint)
    private readonly blueprintRepository: Repository<Blueprint>,

    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>
  ) {}

  
  async saveBlueprint(uploadImageDto: UploadImageDto, imageUrl: string, userId: number) {
    // Kiểm tra Partner tồn tại
    const partner = await this.partnerRepository.findOne({ where: { id: userId } });
    if (!partner) {
      throw new NotFoundException('Partner không tồn tại với userId được cung cấp');
    }

    // Lưu Blueprint liên kết với Partner
    const blueprint = this.blueprintRepository.create({
      name: uploadImageDto.name,
      description: uploadImageDto.description,
      imageUrl,
      partner,
    });

    return await this.blueprintRepository.save(blueprint);
  }
  
}
