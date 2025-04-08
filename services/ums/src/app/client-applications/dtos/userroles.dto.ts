import { ApiProperty } from '@nestjs/swagger';

export class UserRolesDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    usersId: number;

    @ApiProperty()
    roleId: number;

}