import { Subtournament, Team } from '..';

export type Tournament = {
    _id: string;
    name: string;
    subtournaments: Subtournament[] | string[];
    teams: Team[];
};
