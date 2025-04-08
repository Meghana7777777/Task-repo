import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto { 
    @ApiProperty()
    @IsNotEmpty()
    @IsString()    
    readonly password: string;
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string;
  }