import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('student/:id')
  findForStudent(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    // A student may only view their own attendance; faculty may view anyone's.
    if (user.role === Role.STUDENT && user.id !== id) {
      throw new ForbiddenException('You can only view your own attendance.');
    }
    return this.attendanceService.findForStudent(id);
  }

  @Post('mark')
  @Roles(Role.FACULTY)
  markBulk(@CurrentUser() user: User, @Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markBulk(user.id, dto);
  }
}
