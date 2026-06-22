import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsEnum(Role, { message: 'role must be either STUDENT or FACULTY' })
  role: Role;
}
