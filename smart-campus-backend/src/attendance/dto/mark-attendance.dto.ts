import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceRecordDto {
  @IsInt()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  rollNo: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}

export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records: AttendanceRecordDto[];
}
