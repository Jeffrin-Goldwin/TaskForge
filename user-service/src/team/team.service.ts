import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) { }

    async createTeam(userId: string, dto: CreateTeamDto) {
        // 1. Check if user already has a team (Optional: enforce 1 team per user for simplicity)
        const user = await this.prisma.userProfile.findUnique({
            where: { authUserId: userId },
        });

        if (!user) {
            throw new BadRequestException('User profile not found');
        }

        if (user.teamId) {
            throw new BadRequestException('User already belongs to a team');
        }

        // 2. Create Team
        const team = await this.prisma.team.create({
            data: {
                name: dto.name,
            },
        });

        // 3. Update User to belong to this team
        await this.prisma.userProfile.update({
            where: { authUserId: userId },
            data: { teamId: team.id },
        });

        return team;
    }

    async getMyTeam(userId: string) {
        const user = await this.prisma.userProfile.findUnique({
            where: { authUserId: userId },
            include: { team: true }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return user.team;
    }
}
