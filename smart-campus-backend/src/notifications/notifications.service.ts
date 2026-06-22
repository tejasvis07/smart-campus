import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const notifications = await this.prisma.notification.findMany({
      include: { sentBy: { select: { name: true } } },
      orderBy: { sentOn: 'desc' },
    });

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      audience: n.audience,
      sentBy: n.sentBy.name,
      sentOn: n.sentOn.toISOString(),
    }));
  }

  async send(sentById: number, dto: SendNotificationDto) {
    const created = await this.prisma.notification.create({
      data: { ...dto, sentById },
      include: { sentBy: { select: { name: true } } },
    });

    return {
      id: created.id,
      title: created.title,
      body: created.body,
      audience: created.audience,
      sentBy: created.sentBy.name,
      sentOn: created.sentOn.toISOString(),
    };
  }
}
