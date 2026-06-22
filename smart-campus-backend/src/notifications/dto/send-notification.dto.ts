import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body: string;

  @IsString()
  @IsNotEmpty()
  audience: string; // "All Students" | "Semester 5" | a specific rollNo/name
}
