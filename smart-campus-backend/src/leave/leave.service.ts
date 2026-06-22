import { Injectable, NotFoundException } from '@nestjs/common';
import { LeaveStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyLeaveDto } from './dto/apply-leave.dto';

function toFrontendShape(r: {
  id: number;
  studentId: number;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: LeaveStatus;
  appliedOn: Date;
  student: { rollNo: string | null; name: string };
}) {
  return {
    id: r.id,
    studentId: r.studentId,
    rollNo: r.student.rollNo,
    studentName: r.student.name,
    fromDate: r.fromDate.toISOString().slice(0, 10),
    toDate: r.toDate.toISOString().slice(0, 10),
    reason: r.reason,
    status: r.status,
    appliedOn: r.appliedOn.toISOString().slice(0, 10),
  };
}

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async findForStudent(studentId: number) {
    const records = await this.prisma.leaveRequest.findMany({
      where: { studentId },
      include: { student: { select: { rollNo: true, name: true } } },
      orderBy: { appliedOn: 'desc' },
    });
    return records.map(toFrontendShape);
  }

  async findAll() {
    const records = await this.prisma.leaveRequest.findMany({
      include: { student: { select: { rollNo: true, name: true } } },
      orderBy: { appliedOn: 'desc' },
    });
    return records.map(toFrontendShape);
  }

  async apply(studentId: number, dto: ApplyLeaveDto) {
    const created = await this.prisma.leaveRequest.create({
      data: {
        studentId,
        fromDate: new Date(dto.fromDate),
        toDate: new Date(dto.toDate),
        reason: dto.reason,
      },
      include: { student: { select: { rollNo: true, name: true } } },
    });
    return toFrontendShape(created);
  }

  async updateStatus(id: number, reviewedById: number, status: LeaveStatus) {
    const existing = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Leave request ${id} not found`);
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: { status, reviewedById },
      include: { student: { select: { rollNo: true, name: true } } },
    });

    return toFrontendShape(updated);
  }
}
