import { ApiProperty } from '@nestjs/swagger';

export class UserPermDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    permissionId: number;

    @ApiProperty()
    userId: number;

}
