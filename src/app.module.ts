import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { config } from './config';
import { Role, User } from './entities';
import { UserController } from './controllers/user.controller';
import { UsersService } from './services/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards';
import { RolesService } from './services/roles.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: 'localhost',
      type: 'mysql',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'nestjs',
      entities: [User, Role],
      synchronize: true,
      logging: true,
      retryAttempts: 3,
      retryDelay: 3000,
      connectTimeout: 60000,
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UsersService, RolesService, {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
