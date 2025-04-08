import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SlotsDto {
  @ApiProperty()
  roomId: number;

  @ApiProperty()
  date: string;
}