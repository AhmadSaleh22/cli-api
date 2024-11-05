import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Roles } from 'src/types';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional({ message: 'Roles are optional' })
  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: Roles[];
} 
