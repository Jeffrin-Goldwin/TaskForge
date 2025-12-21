import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { validateToken } from '../auth/auth.client';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) { }

    async getMe(authHeader: string) {
        const authUrl = this.config.get('AUTH_SERVICE_URL');
        const { userId, email } = await validateToken(authUrl, authHeader);

        let profile = await this.prisma.userProfile.findUnique({
            where: { authUserId: userId },
        });

        if (!profile) {
            profile = await this.prisma.userProfile.create({
                data: {
                    authUserId: userId,
                    email,
                    name: email.split('@')[0],
                },
            });
        }

        return profile;
    }

    async createProfile(authUserId: string, email: string, name: string) {
        return this.prisma.userProfile.create({
            data: { authUserId, email, name },
        });
    }
}
