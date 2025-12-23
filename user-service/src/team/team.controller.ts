import { Body, Controller, Get, Headers, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { validateToken } from '../auth/auth.client';
import { ConfigService } from '@nestjs/config';

@Controller('team')
export class TeamController {
    constructor(
        private teamService: TeamService,
        private config: ConfigService
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(
        @Headers('authorization') auth: string,
        @Body() dto: CreateTeamDto,
    ) {
        const authUrl = this.config.get('AUTH_SERVICE_URL');
        const { userId } = await validateToken(authUrl, auth);
        return this.teamService.createTeam(userId, dto);
    }

    @Get()
    async getMyTeam(@Headers('authorization') auth: string) {
        const authUrl = this.config.get('AUTH_SERVICE_URL');
        const { userId } = await validateToken(authUrl, auth);
        return this.teamService.getMyTeam(userId);
    }
}
