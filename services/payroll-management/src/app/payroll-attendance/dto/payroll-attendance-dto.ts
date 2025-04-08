import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class PayrollAttendanceDto {
    @ApiProperty({ description: 'Employee ID' })
    @IsInt()
    employeeId: number;

    @ApiProperty({ description: 'Employee Code' })
    @IsString()
    @IsOptional()
    employeeCode: string;

    @ApiProperty({ description: 'Present Count', default: 0 })
    @IsInt()
    @IsOptional()
    presentCount: number = 0;

    @ApiProperty({ description: 'Absent Count', default: 0 })
    @IsInt()
    @IsOptional()
    absentCount: number = 0;

    @ApiProperty({ description: 'Leave Count', default: 0 })
    @IsInt()
    @IsOptional()
    leaveCount: number = 0;

    @ApiProperty({ description: 'CO Count', default: 0 })
    @IsInt()
    @IsOptional()
    coCount: number = 0;

    @ApiProperty({ description: 'OD Count', default: 0 })
    @IsInt()
    @IsOptional()
    odCount: number = 0;

    @ApiProperty({ description: 'WP Count', default: 0 })
    @IsInt()
    @IsOptional()
    wpCount: number = 0;

    @ApiProperty({ description: 'WO Count', default: 0 })
    @IsInt()
    @IsOptional()
    woCount: number = 0;

    @ApiProperty({ description: 'Overtime Hours', default: 0 })
    @IsNumber()
    @IsOptional()
    otHours: number = 0;

    @ApiProperty({ description: 'Holiday Count', default: 0 })
    @IsInt()
    @IsOptional()
    holidayCount: number = 0;

    @ApiProperty({ description: 'HP Count', default: 0 })
    @IsInt()
    @IsOptional()
    hpCount: number = 0;

    @ApiProperty({ description: 'Branch ID' })
    @IsInt()
    branchId: number;

    @ApiProperty({ description: 'Division ID' })
    @IsInt()
    divisionId: number;

    @ApiProperty({ description: 'Created User' })
    @IsString()
    createdUser: string;
}

export class MonthReq{
    @ApiProperty({ description: 'Month for which attendance is being created', example: '202412' })
    month: string;
    @ApiProperty()
    @IsOptional()
    freezeStatus?:number;
}