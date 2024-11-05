import { IsString, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}