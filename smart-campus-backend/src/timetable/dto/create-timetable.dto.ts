import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export class CreateTimetableDto {
  @IsIn(DAYS, { message: 'day must be one of Monday..Friday' })
  day: string;

  @IsInt()
  @Min(1)
  @Max(8)
  period: number;

  @IsString()
  @IsNotEmpty()
  time: string; // e.g. "09:00 - 09:50"

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  room: string;
}
