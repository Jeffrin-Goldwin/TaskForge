import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private task: TaskService) {}

  @Post()
  create(
    @Headers('authorization') auth: string,
    @Body() body: { title: string; description?: string },
  ) {
    return this.task.createTask(auth, body.title, body.description);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'OPEN' | 'IN_PROGRESS' | 'DONE' },
  ) {
    return this.task.updateStatus(id, body.status);
  }

  @Get('me')
  getMyTasks(@Headers('authorization') auth: string) {
    return this.task.getMyTasks(auth);
  }
}
