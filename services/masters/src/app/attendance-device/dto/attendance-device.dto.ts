import { ApiProperty } from "@nestjs/swagger";

export class AttendanceDeviceDto {

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    deviceType: string;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    id? : number;

    @ApiProperty()
    isActive? : boolean;

}