import { ApiProperty } from '@nestjs/swagger';

export class LeaveTypeGroupMappingDto {
  @ApiProperty({
    description: 'UUID of the leave type group mapping',
    example: 'a3c7f8b5-86e2-4d3e-a2d1-ef7e87f21489',
  })
  uuid: string;

  @ApiProperty({
    description: 'Leave Type ID to map with Leave Groups',
    example: 'leaveTypeId123',
  })
  leaveTypeId: number;

  @ApiProperty({
    description: 'Leave Group ID to map with Leave Types',
    example: 'leaveGroupId456',
  })
  leaveGroupId: number;

  @ApiProperty({
    description: 'Company code for the mapping',
    example: 'COMP001',
    required: false,
  })
  companyCode?: string;

  @ApiProperty({
    description: 'Unit code for the mapping',
    example: 'UNIT001',
    required: false,
  })
  @ApiProperty({
    description: 'Is the mapping active?',
    example: true,
    default: true,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Remarks or notes for the mapping',
    example: 'This mapping is for annual leave.',
    required: false,
  })
  remarks?: string;

  @ApiProperty({
    description: 'Created timestamp of the mapping',
    example: '2024-01-01T10:00:00Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'User who created the mapping',
    example: 'admin',
    required: false,
  })
  createdUser?: string;

  @ApiProperty({
    description: 'Last updated timestamp of the mapping',
    example: '2024-01-05T15:30:00Z',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'User who last updated the mapping',
    example: 'superadmin',
    required: false,
  })
  updatedUser?: string;

  @ApiProperty({
    description: 'Version flag for optimistic locking',
    example: 1,
    required: false,
  })
  versionFlag?: number;
}
