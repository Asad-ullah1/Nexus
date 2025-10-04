import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}
