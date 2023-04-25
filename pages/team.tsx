import Layout from '../components/Layout/Layout';
import PlayersTable from '@components/PlayersTable';
import { MatchPreview, NotFound } from '../components';
import { IMAGE_URL } from '@constants';
import apiUrl from '../constants/apiUrl';
import { useEffect } from 'react';

const TeamStats = ({ team, statistics, lastMatch, nextMatch }) => {
    return (
        <Layout id="Match Stats" title="Team Stats">
            {team ? (
                <div className="w-full bg-fondo">
                    <div className="bg-negro-texto text-center uppercase w-full py-5 font-Helvetica font-bold text-sm text-naranja ">
                        ESTADÍSTICAS DE equipo
                    </div>
                    <div className="relative bg-fondo">
                        <img
                            src={`${IMAGE_URL}/${team.teamPicture}`}
                            alt=""
                            className="w-full lg:w-[530px] mx-auto object-cover"
                        />
                        <img
                            src={`${IMAGE_URL}/${team.badge}`}
                            alt=""
                            className="left-1/2 -translate-x-1/2 absolute -bottom-16 w-28 aspect-square object-contain"
                        />
                    </div>

                    <div className="bg-fondo  pt-28 flex justify-center">
                        <div>
                            <div className=" text-center">
                                <p className="font-Helvetica uppercase font-thin">
                                    {' '}
                                    {team.name || '-'}{' '}
                                </p>
                                {/*
                            <p className="text-xs font-din-display mt-1 opacity-60">
                                {' '}
                                #1 en Senior Superior A Apertura
                            </p>
                 */}
                            </div>
                            <div className="mt-12 grid gap-1 lg:gap-1.5 grid-cols-2 lg:grid-cols-4">
                                <div className=" w-[170px]  ">
                                    <div className="bg-violeta rounded-t-sm  py-2 justify-center items-center flex px-2 text-[0.58rem] text-center font-Helvetica">
                                        <span className="opacity-60">
                                            PROM. DE PUNTOS POR PARTIDO
                                        </span>
                                    </div>
                                    <div className="bg-menu rounded-b-sm  shadow-black py-2 justify-center items-center flex text-naranja  text-3xl text-center font-latin">
                                        {statistics.playedMatches
                                            ? (
                                                  statistics.pointsFor /
                                                  statistics.playedMatches
                                              )
                                                  .toFixed(1)
                                                  .replace(/\.0$/, '') || '-'
                                            : 0}
                                    </div>
                                </div>

                                <div className=" w-[170px]  ">
                                    <div className="bg-violeta rounded-t-sm  py-2 justify-center items-center flex px-2 text-[0.58rem] text-center font-Helvetica">
                                        <span className="opacity-60">
                                            PROM. DE PUNTOS RECIBIDOS POR
                                            PARTIDO
                                        </span>
                                    </div>
                                    <div className="bg-menu rounded-b-sm  shadow-black py-2 justify-center items-center flex text-naranja  text-3xl text-center font-latin">
                                        {statistics.playedMatches
                                            ? (
                                                  statistics.pointsAgainst /
                                                  statistics.playedMatches
                                              )
                                                  .toFixed(1)
                                                  .replace(/\.0$/, '') || '-'
                                            : 0}
                                    </div>
                                </div>

                                <div className=" w-[170px]  ">
                                    <div className="bg-violeta rounded-t-sm  py-2 justify-center items-center  px-2 text-[0.58rem] text-center font-Helvetica">
                                        <div className="opacity-60">
                                            PARTIDOS
                                        </div>
                                        <div className="opacity-60">
                                            {' '}
                                            GANADOS
                                        </div>
                                    </div>
                                    <div className="bg-menu rounded-b-sm  shadow-black py-2 justify-center items-center flex text-naranja  text-3xl text-center font-latin">
                                        {statistics.won}
                                    </div>
                                </div>

                                <div className=" w-[170px]  ">
                                    <div className="bg-violeta rounded-t-sm  py-2  px-2 text-[0.58rem] text-center font-Helvetica">
                                        <p className="opacity-60">PARTIDOS </p>
                                        <p className="opacity-60">PERDIDOS</p>
                                    </div>
                                    <div className="bg-menu rounded-b-sm  shadow-black py-2 justify-center items-center flex text-naranja  text-3xl text-center font-latin">
                                        {statistics.lost}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-row gap-12 bg-fondo justify-center pt-12">
                        {lastMatch && (
                            <div className="flex flex-col gap-3 items-center">
                                <span className="text-naranja text-sm text-center  font-Helvetica font-bold">
                                    ÚLTIMO PARTIDO
                                </span>
                                <MatchPreview
                                    matchData={lastMatch}
                                    team1={lastMatch.team1}
                                    team2={lastMatch.team2}
                                />
                            </div>
                        )}
                        {nextMatch && (
                            <div className="flex flex-col gap-3 items-center">
                                <span className="text-naranja text-sm text-center  font-Helvetica font-bold">
                                    PRÓXIMO PARTIDO
                                </span>
                                <MatchPreview
                                    matchData={nextMatch}
                                    team1={nextMatch.team1}
                                    team2={nextMatch.team2}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-3 my-12 bg-fondo">
                        <span className="text-naranja text-sm text-center  font-Helvetica font-bold">
                            LISTA DE JUGADORES
                        </span>

                        <div className="lg:flex items-center justify-center relative bg-fondo">
                            <div className="p-2  top-40 z-10 flex flex-col gap-4  lg:mb-0 ">
                                <PlayersTable
                                    naranja={false}
                                    players={team.players}
                                ></PlayersTable>
                            </div>
                        </div>
                        <p className="text-[0.68rem] text-center  font-din-display px-2">
                            <span className="opacity-70 text-blanco">
                                {' '}
                                PJ:{' '}
                            </span>
                            <span className="opacity-50">
                                Partidos Jugados{' '}
                            </span>
                            <span className="opacity-70 text-blanco">
                                {' '}
                                P.PTS
                            </span>
                            <span className="opacity-50">
                                : Promedio de Puntos -{' '}
                            </span>
                            <span className="opacity-70 text-blanco">P.TL</span>
                            <span className="opacity-50">
                                : Promedio de Tiros Libres -
                            </span>{' '}
                            <br />
                            <span className="opacity-70 text-blanco">
                                P.TC 2P
                            </span>
                            <span className="opacity-50">
                                : Promedio de Tiros de Campo Doble -
                            </span>{' '}
                            <span className="opacity-70 text-blanco">
                                P.TC 3P
                            </span>
                            <span className="opacity-50">
                                : Promedio de Tiros de Campo <br />
                                Triple
                            </span>{' '}
                            <span className="opacity-70 text-blanco">
                                - P.FAL:{' '}
                            </span>
                            <span className="opacity-50">
                                {' '}
                                Promedio de Faltas{' '}
                            </span>
                            <span className="opacity-70 text-blanco">
                                - P.ROB:{' '}
                            </span>
                            <span className="opacity-50">
                                Promedio de Robos{' '}
                            </span>
                            <span className="opacity-70 text-blanco">
                                - P.REB:{' '}
                            </span>
                            <span className="opacity-50">
                                Promedio <br />
                                de Rebotes -{' '}
                            </span>
                            <span className="opacity-70 text-blanco">
                                P.ASIS
                            </span>
                            <span className="opacity-50">
                                : Promedio de Asistencias
                            </span>
                        </p>
                    </div>
                </div>
            ) : (
                <NotFound message="Equipo no encontrado" />
            )}
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const response = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/teams/${context.query.team}`
    );

    const team = await response.json();
    return {
        props: {
            team: team.team?._id ? team.team : '',
            statistics: team.team?._id ? team.statistics : '',
            lastMatch: team.team?._id ? team.lastMatch : '',
            nextMatch: team.team?._id ? team.nextMatch : '',
        },
    };
}

export default TeamStats;
