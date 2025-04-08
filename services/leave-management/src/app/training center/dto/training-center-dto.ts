import { ApiProperty } from "@nestjs/swagger";

export class TrainingCenterDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    meetingRoom: string;
    @ApiProperty()
    capacity: number;
    @ApiProperty()
    location: string;
    @ApiProperty()
    roomApprover: string;
    @ApiProperty()
    roomApproverId: number;
    @ApiProperty()
    isActive: boolean;
    @ApiProperty()
    createdUser: string;
    @ApiProperty()
    updatedUser: string;
    @ApiProperty()
    versionFlag: number;
}