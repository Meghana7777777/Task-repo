// dto/candidate-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CandidateType, SourceType } from './requirement-profile-entity';

export class CandidateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  candidateName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  jobRole: number;

  @IsNotEmpty()
  @IsString()
  profileDate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  qualification: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  technologies: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  stack: string;

  @IsNotEmpty()
  @IsEnum(CandidateType)
  candidateType: CandidateType;

  @IsNotEmpty()
  @IsEnum(SourceType)
  sourceType: SourceType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  referredBy: number;

  @IsNotEmpty()
  @IsDecimal()
  expectedCTC: number;

  @IsNotEmpty()
  @IsDecimal()
  currentCTC: number;

  @IsNotEmpty()
  @IsInt()
  experience: number;

  @IsNotEmpty()
  @IsInt()
  noticePeriod: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  mobileNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alternativeMobile: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resumePath: string;
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;
  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  versionFlag: number;
}
