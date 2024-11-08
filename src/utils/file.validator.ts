import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomFileValidator implements PipeTransform {
  constructor(private options: { maxSize: number }) {}

  transform(file: Express.Multer.File) {
    if (file.size > this.options.maxSize) {
      throw new BadRequestException('File size exceeds maximum limit');
    }
    return file;
  }
}