import { HolidayType } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";


export class HolidayDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    holidayName: string;

    @ApiProperty()
    holidayDate: string;

    @ApiProperty()
    type: HolidayType;

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    isActive: boolean;
}
