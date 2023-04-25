import Layout from '../components/Layout/Layout';
import ScoreTable from '@components/ScoreTable';
import { NotFound } from '@components/index';
import apiUrl from '../constants/apiUrl';
import Link from 'next/link';
import { IMAGE_URL } from '@constants';
import { getTime, getDate } from '@utils/dateFormat';

const MatchStats = ({
    match,
    tournamentId,
    tournamentName,
    subtournamentName,
}) => {
    return (
        <Layout id="Match Stats" title="Match Stats">
            {match ? (
                <div className="w-full bg-fondo  overflow-x-hidden overflow-y-hidden min-h-[170vh] max-w-[100vw]">
                    <div className=" overflow-hidden absolute max-h-[170vh]">
                        <img
                            src="./gradients/big-gradient-naranja.png"
                            alt=""
                            className=" hidden lg:block w-[170vw] h-[2000px] -mt-[740px] -ml-[52vw] overflow-hidden"
                        />
                    </div>

                    <div className="bg-negro-texto text-center uppercase w-full py-5 font-Helvetica font-bold text-sm text-naranja lg:hidden">
                        ESTADÍSTICAS DE PARTIDO
                    </div>
                    <div className="absolute w-full flex flex-col items-center  z-60 min-h-screen overflow-x-hidden">
                        <img
                            src="./gradients/triangulo-big.png"
                            alt=""
                            className="absolute lg:hidden w-[357vw] h-[600px] max-w-none -top-12 left-1/2 -translate-x-1/2 "
                        />

                        <div className="flex top-0 w-[218px] h-[100px]">
                            <div className="lg:hidden  w-1/2 triangulo_left  z-20"></div>
                            <div className="lg:hidden triangulo_right w-1/2 z-10 "></div>
                        </div>
                        <div className="hidden lg:block absolute border-gradient top-0 w-0 h-0 border-l-[400px] border-l-transparent border-r-[400px] border-r-transparent border-t-[360px] z-10  border-t-negro-texto left-1/2 -translate-x-1/2 gradient-negro-texto-dark-up"></div>
                        <div className="hidden lg:block absolute border-gradient top-0 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-t-[75px] border-t-menu left-1/2 -translate-x-1/2 z-20"></div>
                        <img
                            src="./gradients/triangulo-mini.png"
                            alt=""
                            className="absolute lg:hidden w-52 left-1/2 -translate-x-1/2 -top-2 z-10"
                        />

                        <img
                            src="/images/overtimeLogo_bien.png"
                            alt=""
                            className="w-16  absolute top-8 lg:top-4 left-1/2 -translate-x-1/2 z-20"
                        />
                    </div>

                    <div className=" justify-center flex mt-28 z-20">
                        <div className="z-20">
                            <span className="inline text-center uppercase w-full py-5 font-Helvetica text-sm text-naranja pr-2">
                                {tournamentName} <span> </span>
                            </span>
                            <span className="inline text-center uppercase w-full py-5 font-Helvetica font-bold text-sm text-naranja">
                                {subtournamentName}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-6  z-20 ">
                        <div className="text-xs font-din-display  z-20 flex-grow basis-0 mr-0 text-right">
                            {match.date && (
                                <>
                                    <span className=" z-20  opacity-60 inline ">
                                        {' '}
                                        {getDate(new Date(match.date))}{' '}
                                    </span>
                                    <span className=" z-20 inline">
                                        {getTime(new Date(match.date))}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className=" z-20 bg-violeta font-Helvetica  text-xs uppercase py-2 px-5 rounded-sm">
                            <span className=" z-20 opacity-80">
                                {match.matchType}
                            </span>
                        </div>

                        <span className="text-xs font-din-display opacity-60 z-20 flex-grow basis-0">
                            {match.location || '-'}
                        </span>
                    </div>
                    {/* resultado mobile */}
                    <div className="lg:hidden">
                        <div>
                            <div className=" z-20 flex justify-center gap-8 mt-10 font-Helvetica ">
                                <div className="z-20 w-full">
                                    <div className=" z-20 flex justify-evenly w-full gap-5 ">
                                        <img
                                            src={`${IMAGE_URL}/${match.team1.badge}`}
                                            alt=""
                                            className=" z-20 w-24 m-auto object-contain aspect-square"
                                        />
                                        <img
                                            src={`${IMAGE_URL}/${match.team2.badge}`}
                                            alt=""
                                            className=" z-20 w-24 m-auto object-contain aspect-square"
                                        />
                                    </div>

                                    <div className="z-20 flex justify-evenly items-center mt-3">
                                        <span className=" z-20 uppercase text-center  text-sm font-thin w-1/3 leading-none ">
                                            {match.team1.name}
                                        </span>
                                        <div className=" z-20 font-thin   ">
                                            vs
                                        </div>
                                        <span className=" z-20 uppercase text-center  text-sm font-thin  w-1/3 leading-none">
                                            {match.team2.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="z-20 flex justify-center gap-2 mt-12 relative">
                            <img
                                src="./gradients/gradient-naranja-puntaje-mobile.png"
                                alt=""
                                className="absolute lg:hidden  -left-40 top-0 h-16"
                            />
                            <img
                                src="./gradients/gradient-violeta-puntaje-mobile.png"
                                alt=""
                                className="absolute lg:hidden  -right-40 top-0 h-16"
                            />

                            <img
                                src="./gradients/gradient-naranja-puntaje-mobile-arriba.png"
                                alt=""
                                className="absolute lg:hidden -left-64 -top-12 h-10"
                            />
                            <img
                                src="./gradients/gradient-violeta-puntaje-mobile-arriba.png"
                                alt=""
                                className="absolute lg:hidden -right-64 -top-12 h-10"
                            />
                            <div className="z-20 font-latin text-naranja text-6xl font-bold w-1/2 text-center relative">
                                {match.team1Score}
                            </div>
                            <div className="z-20 h-0.5 w-0.5 rounded-full bg-violeta self-center absolute left-1/2 -translate-x-1/2 "></div>
                            <div className="z-20 font-latin text-blanco text-6xl font-bold w-1/2 text-center relative">
                                {match.team2Score}
                            </div>
                        </div>
                    </div>

                    {/* resultado desktop */}
                    <div className="hidden lg:block">
                        <div>
                            <div className=" z-20  font-Helvetica ">
                                <div className=" z-20 flex justify-center m-auto max-w-[1200px] items-center w-full gap-6 relative">
                                    <div className=" flex gap-40 justify-center absolute m-auto">
                                        <img
                                            src="./gradients/gradient-naranja-puntaje-desktop.png"
                                            alt=""
                                            className=" hidden lg:block w-[420px] h-[100px] top-6 left-20"
                                        />
                                        <img
                                            src="./gradients/gradient-violeta-puntaje-desktop.png"
                                            alt=""
                                            className=" hidden lg:block w-[420px] h-[100px] top-6 right-20"
                                        />
                                    </div>
                                    <img
                                        src={`${IMAGE_URL}/${match.team1.badge}`}
                                        alt=""
                                        className=" z-20 w-32 h-32 object-contain aspect-square"
                                    />
                                    <div className="z-20 font-latin  text-naranja text-6xl font-bold text-center w-40 relative">
                                        {match.team1Score}
                                    </div>
                                    <div className="z-20 h-1 w-1 rounded-full bg-violeta self-center "></div>
                                    <div className="z-20 font-latin  text-blanco text-6xl font-bold text-center w-40">
                                        {match.team2Score}
                                    </div>
                                    <img
                                        src={`${IMAGE_URL}/${match.team2.badge}`}
                                        alt=""
                                        className=" z-20 w-32 h-32 object-contain aspect-square"
                                    />
                                </div>

                                <div className="z-20 flex justify-center items-center gap-10 mt-3 max-w-sm m-auto relative">
                                    <img
                                        src="./gradients/gradient-violeta-puntaje-desktop-arriba.png"
                                        alt=""
                                        className="absolute hidden lg:block w-[450px] h-[50px] -top-3 left-52"
                                    />
                                    <span className=" z-20 uppercase text-center  text-sm font-thin w-full leading-none ">
                                        {match.team1.name}
                                    </span>
                                    <div className=" z-20 font-thin font-latin ">
                                        vs
                                    </div>
                                    <img
                                        src="./gradients/gradient-naranja-puntaje-desktop-arriba.png"
                                        alt=""
                                        className="absolute hidden lg:block w-[450px] h-[50px] -top-3 right-56"
                                    />
                                    <span className=" z-20 uppercase text-center text-sm font-thin w-full leading-none">
                                        {match.team2.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="z-20 flex justify-center gap-2 mt-6"></div>
                    </div>
                    {match.videoUrl && (
                        <a
                            className="mt-12 lg:mt-0 z-30 relative flex gap-1.5 items-center justify-center lg:hidden"
                            target="_blank"
                            href={match.videoUrl}
                        >
                            <span className="uppercase font-din-display font-bold text-sm text-naranja ">
                                ver partido{' '}
                            </span>
                            <img
                                src="/logos - iconos/Youtube.png"
                                alt=""
                                className="w-8"
                            />
                        </a>
                    )}

                    <div className="lg:flex items-center lg:items-start justify-center mb-12 relative">
                        <div className="relative mt-44 lg:mt-0 lg:flex">
                            <img
                                src={`${IMAGE_URL}/${match.team1.delegatePicture}`}
                                alt=""
                                className="max-w-[330px] hidden lg:block lg:absolute -left-[58%] -top-56 z-20 w-[330px] h-[576px]"
                            />

                            <img
                                src="./gradients/gradient-naranja.png"
                                alt=""
                                className="absolute lg:hidden  -top-96 -left-24"
                            />
                            <img
                                src={`${IMAGE_URL}/${match.team1.delegatePicture}`}
                                alt=""
                                className="w-[247px] lg:hidden absolute max-h-96  -top-36 left-1/2 -translate-x-1/2"
                            />
                            <div className="flex justify-center">
                                <div className="p-2  top-40 z-30 flex flex-col gap-4 mb-12 lg:mb-0 ">
                                    {match.playersTeam1 && (
                                        <>
                                            <ScoreTable
                                                players={match.playersTeam1}
                                            ></ScoreTable>
                                            <DatosPartidoTexto />
                                        </>
                                    )}

                                    <Link
                                        href={
                                            '/team?tournament=' +
                                            tournamentId +
                                            '&team=' +
                                            match.team1._id
                                        }
                                        className="uppercase bg-naranja text-center text-negro-texto w-32 rounded-sm font-din-display font-bold py-2 text-sm m-auto "
                                    >
                                        {' '}
                                        Ver Equipo
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {match.videoUrl && (
                            <a
                                className="absolute z-30 bottom-0 hidden lg:block"
                                href={match.videoUrl}
                                target="_blank"
                            >
                                <div className=" w-44 h-12 top-5 mt-12 lg:mt-0 flex gap-1.5 items-center justify-center self-end ">
                                    <p className="uppercase font-din-display font-bold text-sm text-naranja ">
                                        ver partido{' '}
                                    </p>
                                    <img
                                        src="/logos - iconos/Youtube.png"
                                        alt=""
                                        className="w-8"
                                    />
                                </div>
                            </a>
                        )}

                        <div className="relative mt-44 lg:mt-0 lg:flex">
                            <div className="flex justify-center">
                                <div className="p-2  top-44 z-30 flex flex-col gap-4 mb-12 lg:mb-0">
                                    {match.playersTeam2 && (
                                        <>
                                            <ScoreTable
                                                naranja={false}
                                                players={match.playersTeam2}
                                            ></ScoreTable>
                                            <DatosPartidoTexto />
                                        </>
                                    )}
                                    <Link
                                        href={
                                            '/team?tournament=' +
                                            tournamentId +
                                            '&team=' +
                                            match.team2._id
                                        }
                                        className="uppercase bg-naranja text-center text-negro-texto w-32 rounded-sm font-din-display font-bold py-2 text-sm m-auto "
                                    >
                                        {' '}
                                        Ver Equipo
                                    </Link>
                                </div>
                            </div>

                            <img
                                src={`${IMAGE_URL}/${match.team2.delegatePicture}`}
                                alt=""
                                className="w-[247px] lg:hidden absolute h-96  -top-36 left-1/2 -translate-x-1/2  "
                            />
                            <img
                                src="./gradients/gradient-violeta.png"
                                alt=""
                                className="absolute lg:hidden  -top-96 -right-24"
                            />
                            <img
                                src={`${IMAGE_URL}/${match.team2.delegatePicture}`}
                                alt=""
                                className="hidden lg:block lg:absolute left-[320px] -top-56 z-20 w-[330px] h-[576px]"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <NotFound message="Partido no encontrado" />
            )}
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const matchPromise = fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.subtournament}/matches/${context.query.match}`
    );
    const subtournamentPromise = fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.subtournament}`
    );

    const [matchResponse, subtournamentResponse] = await Promise.all([
        matchPromise,
        subtournamentPromise,
    ]);

    const { tournament, subtournament } = await subtournamentResponse.json();
    const match = await matchResponse.json();
    return {
        props: {
            match: match?._id ? match : null,
            tournamentId: context.query.tournament || null,
            tournamentName: tournament?.name || null,
            subtournamentName: subtournament?.name || null,
        },
    };
}

function DatosPartidoTexto() {
    return (
        <p className="text-[0.68rem] text-center  font-din-display px-2">
            <span className="opacity-70 text-blanco">PTS: </span>
            <span className="opacity-50">Puntos</span>
            <span className="opacity-70 text-blanco"> TL: </span>
            <span className="opacity-50">Tiros Libres -</span>
            <span className="opacity-70 text-blanco"> TC 2P: </span>
            <span className="opacity-50"> Tiro de Campo Doble - </span>{' '}
            <span className="opacity-70 text-blanco"> TC 3P: </span>
            <span className="opacity-50">
                {' '}
                Tiro de Campo <br /> Triple -{' '}
            </span>{' '}
            <span className="opacity-70 text-blanco"> FAL: </span>
            <span className="opacity-50"> Faltas - </span>{' '}
            <span className="opacity-70 text-blanco"> ROB: </span>
            <span className="opacity-50"> Robos - </span>
            <span className="opacity-70 text-blanco"> REB: </span>
            <span className="opacity-50"> Rebotes - </span>
            <span className="opacity-70 text-blanco"> ASIS: </span>
            <span className="opacity-50"> Asistencias </span>
        </p>
    );
}

export default MatchStats;
