import { IsIn } from 'class-validator';

export class UpdateLeaveStatusDto {
  @IsIn(['APPROVED', 'REJECTED'], { message: 'status must be APPROVED or REJECTED' })
  status: 'APPROVED' | 'REJECTED';
}
