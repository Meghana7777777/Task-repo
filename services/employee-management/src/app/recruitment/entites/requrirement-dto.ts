import { ApiProperty } from '@nestjs/swagger';

export class RecruitmentDto {
    @ApiProperty()
    id?: number;
  @ApiProperty()
  jobRole: string;
  @ApiProperty()
  company: string;

  @ApiProperty()
  jobDescription: string;

  @ApiProperty()
  notificationDate: Date;

  @ApiProperty()
  resourceRequired: number;

  @ApiProperty()
  technology: string;

  @ApiProperty()
  planningClosingDate: Date;

  @ApiProperty()
  billingRate: string;

  @ApiProperty()
  approxExperience: string;

  @ApiProperty()
  minProjectDuration: string;

  @ApiProperty()
  expensesPaidByClient: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  jobLocation: string;

  @ApiProperty()
  remarks?: string;

  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
}
