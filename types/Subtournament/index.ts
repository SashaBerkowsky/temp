import { Team, Match } from '..';

export type Subtournament = {
    _id?: string;
    name?: string;
    isPlayoff?: boolean;
    zones?: boolean;
    teams?: Team[] | string[];
    teams2?: Team[] | string[];
    matches?: Match[];
    next6Matches?: Match[];
    last6Matches?: Match[];
    playoffConfig?: {
        datesNames: string[];
        teams: number;
    };
};
