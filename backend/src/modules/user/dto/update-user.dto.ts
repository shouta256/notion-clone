import { IsEmail, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;
}
