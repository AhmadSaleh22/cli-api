import { Controller, Get, Post, Body, Put, Delete, Param, BadRequestException, Req, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Headers } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserResponseDto, Roles as Role } from 'src/types';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Headers('authorization') token: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    const users = await this.usersService.findAll({
      page,
      limit,
      route: 'user',
    });
    return {
        users: users.items.map(({ password, ...user }) => user),
        total: users.meta.totalItems,
        page: users.meta.currentPage,
        limit: users.meta.itemsPerPage,
        totalPages: users.meta.totalPages,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    return {
      exists: !!user,
      user: user ? { 
        id: user.id,
        username: user.username,
        email: user.email
      } : null
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
    else if (createUserDto.roles) {
      // Check for duplicate roles
      const uniqueRoles = new Set(createUserDto.roles);
      if (uniqueRoles.size !== createUserDto.roles.length) {
        throw new BadRequestException({
          message: 'Duplicate roles are not allowed',
          details: {
            roles: 'Each role can only be assigned once'
          }
        });
      }

      // Check if all roles are valid
      const validRoles = Object.values(Role);
      const invalidRoles = createUserDto.roles.filter(role => !validRoles.includes(role));
      if (invalidRoles.length > 0) {
        throw new BadRequestException({
          message: 'Invalid roles provided',
          details: {
            roles: `Invalid roles: ${invalidRoles.join(', ')}. Valid roles are: ${validRoles.join(', ')}`
          }
        });
      }
      
      // Check if roles array is empty
      if (createUserDto.roles.length === 0) {
        throw new BadRequestException({
          message: 'Roles are required',
        });
      }
    }
    //check if a user exists with the same email or username
    const userExists = await this.usersService.findByUsername(createUserDto.username) || await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException({
        error: 'User already exists',
        message: 'User already exists',
        status: 400,
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Delete()
//   @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
//   @UseGuards(RolesGuard)
  deleteAllUsers() {
    return this.usersService.deleteAll();
  }
}
