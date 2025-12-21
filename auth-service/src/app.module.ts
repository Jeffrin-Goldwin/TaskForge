import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }) ,PrismaModule, AuthModule],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService, JwtService],
  
})
export class AppModule {}
