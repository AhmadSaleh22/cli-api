import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config accessible everywhere
    }),
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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User, Role]),
    AuthModule
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UsersService, RolesService, AuthService, {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
