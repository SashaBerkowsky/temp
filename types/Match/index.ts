import { Player, Team } from '..';

export type Match = {
    _id?: string;
    id?: string;
    team1: Team | string;
    team2: Team | string;
    isTournamentMatch: boolean;
    subtournamentId?: string;
    round: number | string;
    isPlayoff: boolean;
    matchType: string;
    playersTeam1: Player[];
    playersTeam2: Player[];
    date?: string;
    location?: string;
    team1Score?: number;
    team2Score?: number;
    videoUrl?: string;
};
