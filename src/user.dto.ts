import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @Expose()
  username: string;

  @IsNotEmpty()
  @Length(10, 20)
  @Expose()
  password: string;
}
