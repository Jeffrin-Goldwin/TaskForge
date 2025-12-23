import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { validateToken } from '../auth/auth.client';
import { ConfigService } from '@nestjs/config';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) { }

  async createTask(
    authHeader: string,
    title: string,
    description?: string,
  ) {
    const authUrl = this.config.get('AUTH_SERVICE_URL');
    const { userId } = await validateToken(authUrl, authHeader);

    return this.prisma.task.create({
      data: {
        title,
        description,
        assignedTo: userId,
      },
    });
  }

  async updateStatus(taskId: string, status: TaskStatus) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async getMyTasks(authHeader: string) {
    const authUrl = this.config.get('AUTH_SERVICE_URL');
    const { userId } = await validateToken(authUrl, authHeader);

    return this.prisma.task.findMany({
      where: { assignedTo: userId },
    });
  }
}
