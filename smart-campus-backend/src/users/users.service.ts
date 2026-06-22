import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Used by the faculty "Mark Attendance" roster table.
  // In a fuller implementation this would filter by the faculty's assigned
  // section/department; kept simple here as "all students".
  async getStudentRoster() {
    const students = await this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: { id: true, rollNo: true, name: true },
      orderBy: { rollNo: 'asc' },
    });
    return students;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
