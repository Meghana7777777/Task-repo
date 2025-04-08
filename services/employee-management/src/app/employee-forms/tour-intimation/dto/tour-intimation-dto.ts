import { ApiProperty } from "@nestjs/swagger";
export class TourIntimationDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    employeeId: number;

    @ApiProperty()
    fromPlace: string

    @ApiProperty()
    toPlace: string

    @ApiProperty()
    fromDate: Date

    @ApiProperty()
    toDate: Date

}
