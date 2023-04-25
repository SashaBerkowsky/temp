import { Player, TeamStats } from '..';

export type Team = {
    _id?: string;
    name: string;
    subtournaments: string[];
    subtournamentId?: string;
    badge: string;
    teamPicture: string;
    delegatePicture: string;
    players?: Player[];
    statistics?: TeamStats;
};
