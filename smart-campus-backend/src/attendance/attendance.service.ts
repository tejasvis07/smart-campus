import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findForStudent(studentId: number) {
    const records = await this.prisma.attendance.findMany({
      where: { studentId },
      include: { student: { select: { rollNo: true } } },
      orderBy: { date: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      rollNo: r.student.rollNo,
      subject: r.subject,
      date: r.date.toISOString().slice(0, 10),
      status: r.status,
    }));
  }

  async markBulk(facultyId: number, dto: MarkAttendanceDto) {
    const date = new Date(dto.date);

    const created = await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.attendance.create({
          data: {
            subject: dto.subject,
            date,
            status: record.status,
            studentId: record.studentId,
            markedById: facultyId,
          },
        }),
      ),
    );

    const createdRecords = created as Array<{
      id: number;
      studentId: number;
      subject: string;
      date: Date;
      status: string;
    }>;

    return createdRecords.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      rollNo: dto.records.find((rec) => rec.studentId === r.studentId)?.rollNo,
      subject: r.subject,
      date: r.date.toISOString().slice(0, 10),
      status: r.status,
    }));
  }
}
