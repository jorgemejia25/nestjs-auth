import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  username: string;
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  role: string;
}

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
