import { Module } from '@nestjs/common';
import { UsersService } from 'src/services';
import { UserController } from 'src/controllers';

@Module({
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
