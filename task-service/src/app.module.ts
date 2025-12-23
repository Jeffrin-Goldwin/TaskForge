import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { TaskService } from './task/task.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
