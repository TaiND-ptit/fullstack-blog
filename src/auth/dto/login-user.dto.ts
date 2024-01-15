// import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
