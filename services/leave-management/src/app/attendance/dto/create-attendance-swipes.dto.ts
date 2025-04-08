import { IsEnum, IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAttendanceSwipeDto {
  employeeNumber: string;

  employeeName: string;

  cardNumber: string;

  swipeDate: string;

  swipeTime: string;

  branch: string;

  readerNumber?: number;

  ip: string;

  inOut: 'IN' | 'OUT';

  // @IsDateString()
  downloadedDateTime?: Date;
  status?: number;
}
