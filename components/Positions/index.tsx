import { Leaderboard, FeaturedFrame } from '..';
import { Team, Player } from '@types';

type TableItem = {
    team: Team;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    pointsDifference: number;
    totalPoints: number;
    concededPoints: number;
};

type TopScorer = {
    player: Player;
    played?: number;
    pt1: number;
    pt2: number;
    pt3: number;
    points: number;
    fouls: number;
    assists: number;
    rebounds: number;
    steals: number;
};

type Props = {
    table: TableItem[];
    topScorers: TopScorer[];
    top3ScorersTeams: TableItem[];
    top3ConcededTeams: TableItem[];
};

const Positions = ({
    table,
    topScorers,
    top3ScorersTeams,
    top3ConcededTeams,
}: Props) => {
    const findTeamData = (teamid: string) => {
        if (teamid) {
            const { team } = table?.find(
                (position) => position.team._id === teamid
            );

            return {
                picture: team.badge,
                name: team.name,
            };
        } else {
            return {
                picture: '',
                name: '',
            };
        }
    };
    return (
        <div className="h-auto px-2 md:px-4 lg:px-0 md:flex justify-center gap-x-14 bg-fondo">
            <div className="w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 text-center ">
                <h1 className="font-Helvetica font-bold uppercase text-sm pb-8">
                    Tabla del torneo
                </h1>
                <div className="w-full text-center font-Helvetica font-thin">
                    <Leaderboard table={table} />
                    <p className="pt-4 text-xs font-din-display text-center text-blanco opacity-60">
                        PJ: Partidos Jugados - PG: Partidos Ganados - PP:
                        Partidos Perdidos - DP: Diferencia de Puntos
                    </p>
                </div>
            </div>
            <div className="w-80 h-max text-center flex flex-col-reverse md:flex-col md:mt-0 mx-auto lg:mx-0">
                <div className="h-64 flex flex-col justify-between mt-16 md:mt-0">
                    <h1 className="font-Helvetica font-bold uppercase text-sm">
                        Equipos con mas puntos
                    </h1>
                    <div className="flex h-4/5 mt-5">
                        {top3ScorersTeams?.map((t, i) => (
                            <FeaturedFrame
                                position={i}
                                variant="team"
                                data={t}
                                type="total"
                                key={i}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-64 mt-16">
                    <h1 className="mx-auto font-Helvetica font-bold uppercase text-sm w-2/3">
                        Equipos con menos puntos recibidos
                    </h1>
                    <div className="flex h-4/5 mt-5">
                        {top3ConcededTeams?.map((t, i) => (
                            <FeaturedFrame
                                position={i}
                                variant="team"
                                data={t}
                                type="conceded"
                                key={i}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-[28rem] mt-16">
                    <h1 className="font-Helvetica font-bold uppercase text-sm">
                        Mayores Puntuadores
                    </h1>
                    <div className="flex h-4/5 mt-5">
                        {topScorers?.map((p, i) => (
                            <FeaturedFrame
                                position={i}
                                variant="player"
                                data={{
                                    ...p,
                                    team: findTeamData(p.player.team),
                                }}
                                key={i}
                            />
                        ))}
                    </div>
                    <p className="pt-4 text-xs font-din-display text-center text-blanco opacity-60">
                        PPP: Promedio de Puntos por Partido - PT: Puntos Totales
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Positions;
