
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    oldPassword: string;
    @ApiProperty()
    newPassword: string;
}
