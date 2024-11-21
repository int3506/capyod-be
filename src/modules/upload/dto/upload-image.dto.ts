import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Tên blueprint

  @IsNotEmpty()
  @IsString()
  description: string; // Mô tả blueprint
}
