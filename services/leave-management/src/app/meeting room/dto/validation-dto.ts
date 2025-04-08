import { ApiProperty } from '@nestjs/swagger';

export class ValidationDto {

    @ApiProperty()
    roomId: number;
    
    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;
}