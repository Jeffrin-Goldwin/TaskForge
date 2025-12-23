import { Body, Controller, Get, Headers, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TaskController {
  constructor(private task: TaskService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  create(
    @Headers('authorization') auth: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.task.createTask(auth, dto);
  }

  @Put(':id/status')
  @UsePipes(new ValidationPipe())
  updateStatus(
    @Headers('authorization') auth: string,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.task.updateStatus(id, dto.status, auth);
  }

  @Get()
  getTasks(@Headers('authorization') auth: string) {
    return this.task.getTasks(auth);
  }
}
