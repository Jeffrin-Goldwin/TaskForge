import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class JoinTeamDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    teamId: string;
}
