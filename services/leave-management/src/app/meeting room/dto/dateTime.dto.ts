import { ApiProperty } from '@nestjs/swagger';

export class DateTimeDto {
    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;
}
