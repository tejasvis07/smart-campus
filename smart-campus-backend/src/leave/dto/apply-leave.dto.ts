import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ApplyLeaveDto {
  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  reason: string;
}
