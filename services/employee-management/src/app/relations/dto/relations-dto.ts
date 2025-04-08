import {IsAlphanumeric, MaxLength, Matches, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RelationDTO {
  @ApiProperty()
  
  id: number;
  @ApiProperty()
  relation: string;
  @ApiProperty()
  isActive: boolean;

  createdAt : Date;

  @ApiProperty()
  createdUser : string;

  updatedAt : Date;
  @ApiProperty()
  updatedUser : string;

  @ApiProperty()
  versionFlag : number;
  @ApiProperty()
  companyCode: string; // Add this if not present
}

