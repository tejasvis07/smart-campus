import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const entries = await this.prisma.timetable.findMany({
      include: { faculty: { select: { name: true } } },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
    });

    // Shape to match what the frontend expects: a flat `faculty` name string
    return entries.map((e) => ({
      id: e.id,
      day: e.day,
      period: e.period,
      time: e.time,
      subject: e.subject,
      room: e.room,
      faculty: e.faculty.name,
    }));
  }

  async create(facultyId: number, dto: CreateTimetableDto) {
    const entry = await this.prisma.timetable.create({
      data: { ...dto, facultyId },
      include: { faculty: { select: { name: true } } },
    });

    return {
      id: entry.id,
      day: entry.day,
      period: entry.period,
      time: entry.time,
      subject: entry.subject,
      room: entry.room,
      faculty: entry.faculty.name,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.timetable.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Timetable entry ${id} not found`);
    }
    await this.prisma.timetable.delete({ where: { id } });
    return { id, deleted: true };
  }
}
