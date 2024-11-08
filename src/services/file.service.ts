import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { File } from '@/entities/file.entity';

@Injectable()
export class FileService implements OnModuleInit {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async onModuleInit() {
    // Ensure upload directory exists
    if (process.env.UPLOAD_DIR) {
      await fs.mkdir(process.env.UPLOAD_DIR, { recursive: true });
    } else {
      throw new Error('UPLOAD_DIR environment variable is not defined');
    }
  }

  async deleteFilesOlderThan(date: Date) {
    // Find old files
    const oldFiles = await this.fileRepository.find({
      where: {
        createdAt: LessThan(date)
      }
    });

    // Delete physical files and database records
    for (const file of oldFiles) {
      try {
        if (process.env.UPLOAD_DIR && file.filename) {
          await fs.unlink(path.join(process.env.UPLOAD_DIR, file.filename));
          await this.fileRepository.remove(file);
        } else {
          throw new Error('UPLOAD_DIR environment variable or file filename is not defined');
        }
      } catch (error) {
        // Continue with other files if one fails
        console.error(`Failed to delete file ${file.filename}:`, error);
      }
    }

    return oldFiles.length;
  }
}