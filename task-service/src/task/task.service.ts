import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getUserProfile } from '../user/user.client';
import { ConfigService } from '@nestjs/config';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) { }

  async createTask(
    authHeader: string,
    dto: CreateTaskDto,
  ) {
    const userServiceUrl = this.config.get('USER_SERVICE_URL');
    if (!userServiceUrl) throw new Error('USER_SERVICE_URL not configured');

    const user = await getUserProfile(userServiceUrl, authHeader);

    if (!user.teamId) {
      throw new BadRequestException('User must belong to a team to create tasks');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        assignedTo: user.authUserId,
        teamId: user.teamId,
      },
    });
  }

  async updateStatus(taskId: string, status: TaskStatus, authHeader: string) {
    // We should also check if the user belongs to the same team as the task
    // For now, simpler implementation, but strict security would require fetching the task first.

    // 1. Fetch Task
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new BadRequestException('Task not found');

    // 2. Fetch User
    const userServiceUrl = this.config.get('USER_SERVICE_URL');
    const user = await getUserProfile(userServiceUrl, authHeader);

    // 3. Verify Team
    if (task.teamId !== user.teamId) {
      throw new BadRequestException('Access denied: Task belongs to another team');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async getTasks(authHeader: string) {
    const userServiceUrl = this.config.get('USER_SERVICE_URL');
    if (!userServiceUrl) throw new Error('USER_SERVICE_URL not configured');

    const user = await getUserProfile(userServiceUrl, authHeader);

    if (!user.teamId) {
      return []; // Or throw error
    }

    return this.prisma.task.findMany({
      where: { teamId: user.teamId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
