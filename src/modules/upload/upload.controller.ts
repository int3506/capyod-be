import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid";
import { extname, join } from "path";
import { UploadService } from "./upload.service";
import { UploadImageDto } from './dto/upload-image.dto';

@Controller("uploads")
export class UploadController {
  private readonly serverUrl = "http://localhost:3000";
  constructor(private readonly uploadService: UploadService) {}

  @Post("images")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(__dirname, "..", "..", "..", "uploads", "images"),
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error("Only image files are allowed!"), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadImageWithDescription(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id; // Lấy ID người dùng từ JWT
    if (!userId) {
      throw new Error("User ID is required");
    }
    console.log('User ID:', userId);
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${file.filename}`;
    //const fileUrl = `${this.serverUrl}/uploads/images/${file.filename}`;

    // Lưu Blueprint và liên kết với Partner
    const blueprint = await this.uploadService.saveBlueprint(
      uploadImageDto, 
      fileUrl, 
      userId
    );

    return {
      message: 'Blueprint uploaded successfully',
      blueprint,
    };
  }
}
