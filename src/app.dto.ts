import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class QueryAppDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
}