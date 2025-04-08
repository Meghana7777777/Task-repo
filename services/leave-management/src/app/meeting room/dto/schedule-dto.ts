import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from 'libs/shared-models/src/lib/enums/meeting-room-enums';

export class ScheduleStatusDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    approveStatus: ScheduleStatus;

    @ApiProperty()
    createdUser: string;
}
