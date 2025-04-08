import { interviewStatus, InterViewType } from "@hrexpert/shared-models";
import { ApiProperty } from "@nestjs/swagger";

export class RecruitmentInterviewsDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    interviewDate: Date

    @ApiProperty()
    interviewType: InterViewType

    @ApiProperty()
    interviewer: number

    @ApiProperty()
    interviewerMobNo: string

    @ApiProperty()
    client: number

    @ApiProperty()
    jobRole: number

    @ApiProperty()
    candidateName: number

    @ApiProperty()
    referredBy: string

    @ApiProperty()
    status: interviewStatus

    @ApiProperty()
    remarks: string



    @ApiProperty()
    isActive: boolean

    @ApiProperty()
    versionFlag: number;



}