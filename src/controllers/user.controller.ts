import { Controller, Get, Post, Body, Put, Delete, Param, BadRequestException, Req, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserResponseDto, Roles as Role } from 'src/types';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.usersService.findAll({
      page,
      limit,
      route: 'user',
    });
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.username || !createUserDto.password || !createUserDto.email) {
      throw new BadRequestException({
        message: 'Missing required fields',
        details: {
          username: !createUserDto.username ? 'Username is required' : undefined,
          password: !createUserDto.password ? 'Password is required' : undefined,
          email: !createUserDto.email ? 'Email is required' : undefined
        }
      });
    }

    const user = await this.usersService.create(createUserDto);
    const singleUser = Array.isArray(user) ? user[0] : user;
    const { password, ...userWithoutPassword } = singleUser;
    return userWithoutPassword;
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() body: User) {
    const user = new User();
    Object.assign(user, { ...body, id });
    return this.usersService.update(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
