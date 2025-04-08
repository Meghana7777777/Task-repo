import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserNameDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string;
  }