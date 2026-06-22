import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { LeaveService } from './leave.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('student/:id')
  findForStudent(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    if (user.role === Role.STUDENT && user.id !== id) {
      throw new ForbiddenException(
        'You can only view your own leave requests.',
      );
    }
    return this.leaveService.findForStudent(id);
  }

  @Get('all')
  @Roles(Role.FACULTY)
  findAll() {
    return this.leaveService.findAll();
  }

  @Post('apply')
  @Roles(Role.STUDENT)
  apply(@CurrentUser() user: User, @Body() dto: ApplyLeaveDto) {
    return this.leaveService.apply(user.id, dto);
  }

  @Patch(':id/status')
  @Roles(Role.FACULTY)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateLeaveStatusDto,
  ) {
    return this.leaveService.updateStatus(id, user.id, dto.status);
  }
}
