import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
// import { FileService } from './file.service';
import { Logger } from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly fileService: FileService) {}

  onModuleInit() {
    this.initializeJobs();
  }

  private initializeJobs() {
    // Run at midnight every day (0 0 * * *)
    cron.schedule('0 0 * * *', async () => {
      try {
        await this.cleanupOldFiles();
        this.logger.log('Daily file cleanup completed successfully');
      } catch (error) {
        this.logger.error('File cleanup failed:', error);
      }
    });
  }

  private async cleanupOldFiles() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await this.fileService.deleteFilesOlderThan(thirtyDaysAgo);
  }
}