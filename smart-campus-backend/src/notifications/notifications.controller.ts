import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    // Both students and faculty can view the notification feed.
    return this.notificationsService.findAll();
  }

  @Post()
  @Roles(Role.FACULTY)
  send(@CurrentUser() user: User, @Body() dto: SendNotificationDto) {
    return this.notificationsService.send(user.id, dto);
  }
}
