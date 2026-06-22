import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Controller('timetable')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  findAll() {
    // Both students and faculty can view the timetable.
    return this.timetableService.findAll();
  }

  @Post()
  @Roles(Role.FACULTY)
  create(@CurrentUser() user: User, @Body() dto: CreateTimetableDto) {
    return this.timetableService.create(user.id, dto);
  }

  @Delete(':id')
  @Roles(Role.FACULTY)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timetableService.remove(id);
  }
}
