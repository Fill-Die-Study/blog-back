import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @IsString()
  @MaxLength(30)
  name: string;
}
