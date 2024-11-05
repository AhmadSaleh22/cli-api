import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { RolesService } from './roles.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { Role } from 'src/entities/roles.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findAll(options: IPaginationOptions) {
    return paginate<User>(this.usersRepository, options);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    // Omit role (not roles) from DTO to create base user
    const { roles, ...userData } = createUserDto;
    const user = this.usersRepository.create(userData);
    
    return this.usersRepository.save(user);
  }

  async update(user: User) {
    return this.usersRepository.update(user.id, user);
  }

  async findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async delete(id: number) {
    return this.usersRepository.delete(id);
  }

  async addRole(userId: number, roleName: string) {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['roles'] 
    }) as User;
    const role = await this.rolesService.findByName(roleName);
    
    user.roles.push(role as Role);
    return this.usersRepository.save(user as User);
  }
}
