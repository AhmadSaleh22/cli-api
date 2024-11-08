import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  UseGuards,
  BadRequestException,
  ParseFilePipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CustomFileValidator } from '@/utils/file.validator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  private readonly uploadDir = 'uploads';

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage()
  }))
  async uploadFile(
    @UploadedFile(
      new CustomFileValidator({
        maxSize: 5 * 1024 * 1024 // 5MB
      })
    ) file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${uniqueSuffix}${extname(file.originalname)}`;
      
      // Ensure upload directory exists
      await fs.mkdir(this.uploadDir, { recursive: true });
      
      // Save file
      const filePath = path.join(this.uploadDir, filename);
      await fs.writeFile(filePath, file.buffer);

      return {
        message: 'File uploaded successfully',
        filename,
        path: filePath
      };
    } catch (error) {
      throw new BadRequestException('Failed to save file: ' + error.message);
    }
  }
}
