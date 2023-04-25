import { useState, useEffect } from 'react';
import Link from 'next/link';
import Datepicker from 'react-tailwindcss-datepicker';
import TeamPickerDropdown from '../../components/teamPickerDropdown';
import { Tournament, Team, Match, Subtournament, Player } from '@types';
import { useRouter } from 'next/router';
import { useLoading } from '@context/LoadingContext';
import { AUTH_TOKEN, IMAGE_URL } from '@constants';
import apiUrl from '../../constants/apiUrl';
import AdminLayout from '@components/Admin/AdminLayout';
import TextField from '@components/TextField';

type DateValue = {
    startDate: string;
    endDate: string;
};

type MatchErrors = {
    team1: boolean;
    team2: boolean;
    matchType: boolean;
    date: boolean;
    round: boolean;
};

type MatchPlayer = {
    player: Player;
    totalScore: number;
    fouls: number;
    assists: number;
    rebounds: number;
    steals: number;
    captain: boolean;
    mvp: boolean;
    pt3: number;
    pt2: number;
    pt1: number;
};

const formatInitialDate = (date: Date): string => {
    const datestr = date.toLocaleString('en-Us', {
        timeZone: 'America/Argentina/Buenos_Aires',
    });
    return datestr.split(',')[0];
};
const formatInitialTime = (date: Date): string => {
    const hours = String(date.getHours());
    const minutes = String(date.getMinutes());
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const CrearPartido = ({ match, tournament, subtournament }) => {
    const router = useRouter();
    const { changeLoading } = useLoading();

    const errorStyle: string =
        'underline underline-offset-4 decoration-naranja decoration-4';
    const [hasErrors, setHasErrors] = useState<MatchErrors>({
        team1: false,
        team2: false,
        matchType: false,
        date: false,
        round: false,
    });
    const [dateValueDay, setDateValueDay] = useState<DateValue>({
        startDate: match?.date ? formatInitialDate(new Date(match.date)) : null,
        endDate: match?.date ? formatInitialDate(new Date(match.date)) : null,
    });

    const handleDateValueDayChange = (newDateValueDay: DateValue): void => {
        setDateValueDay(newDateValueDay);
    };

    const [dateValueTime, setDateValueTime] = useState<string>(
        match?.date ? formatInitialTime(new Date(match.date)) : ''
    );

    const handleDateValueTimeChange = (newTime: string): void => {
        setDateValueTime(newTime);
    };

    const [matchType, setMatchType] = useState<string>(
        match?.matchType ? match.matchType : 'torneo'
    );
    const [otherType, setOtherType] = useState<string>(
        match?.matchType &&
            match?.matchType !== 'torneo' &&
            match?.matchType !== 'amistoso'
            ? match.matchType
            : ''
    );

    const [round, setRound] = useState<string>(match?.round ? match.round : '');

    const [team1Score, setTeam1Score] = useState<string>(
        match && match?.team1Score !== '' ? match.team1Score : ''
    );
    const [team2Score, setTeam2Score] = useState<string>(
        match && match?.team2Score !== '' ? match.team2Score : ''
    );

    const [team1, setTeam1] = useState<Team>(match?.team1 ? match.team1 : null);
    const [team2, setTeam2] = useState<Team>(match?.team2 ? match.team2 : null);

    const [location, setLocation] = useState<string>(
        match?.location ? match.location : ''
    );

    const [videoUrl, setVideoUrl] = useState({
        value: match?.videoUrl ? match.videoUrl : '',
        isEditing: false,
    });

    const isPlayerPresent = (playerid: string): boolean => {
        return (
            team1?.players?.some((p1) => p1._id === playerid && p1.played) ||
            team2?.players?.some((p2) => p2._id === playerid && p2.played)
        );
    };

    const getPlayerTotalPoints = (id: string, team: number): number => {
        let totalPoints: number = 0;
        const player =
            team === 1
                ? team1.players.find(({ _id }) => _id === id)
                : team2.players.find(({ _id }) => _id === id);

        // tuve que hacerlo asi, sino los numeros se concatenaban en vez de sumarse
        if (player?.pt1) {
            totalPoints += Number(player.pt1);
        }
        if (player?.pt2) {
            totalPoints += Number(player.pt2) * 2;
        }
        if (player?.pt3) {
            totalPoints += Number(player.pt3) * 3;
        }

        return totalPoints;
    };

    const updatePlayer = (
        playerid: string,
        field: string,
        value: any,
        team: number
    ): void => {
        let newPlayers: Player[] = [];
        if (team === 1) {
            newPlayers = team1.players.map((p) => {
                if (p._id === playerid) {
                    p[field] = value;
                    return p;
                } else if (field === 'captain' || field === 'mvp') {
                    p[field] = false;
                    return p;
                }
                return p;
            });
            setTeam1({ ...team1, players: newPlayers });
        } else {
            newPlayers = team2.players.map((p) => {
                if (p._id === playerid) {
                    p[field] = value;
                    return p;
                } else if (field === 'captain' || field === 'mvp') {
                    p[field] = false;
                    return p;
                }
                return p;
            });
            setTeam2({ ...team2, players: newPlayers });
        }
    };

    const addEmptyPlayer = (p: Player): Player => {
        return {
            _id: p._id,
            name: p.name,
            picture: p.picture,
            pt1: '',
            pt2: '',
            pt3: '',
            fouls: '',
            assists: '',
            rebounds: '',
            steals: '',
            captain: false,
            mvp: false,
        };
    };

    const handleTeamChange = async (
        teamid: string,
        teamNumber: number
    ): Promise<void> => {
        changeLoading(true);
        try {
            const res = await fetch(
                `${apiUrl}/tournaments/${tournament._id}/teams/${teamid}`
            );
            const parsedRes = await res.json();

            if (parsedRes.team) {
                if (teamNumber === 1) {
                    setTeam1({
                        ...parsedRes.team,
                        players: parsedRes.team.players.map((p: Player) =>
                            addEmptyPlayer(p)
                        ),
                    });
                } else if (teamNumber === 2) {
                    setTeam2({
                        ...parsedRes.team,
                        players: parsedRes.team.players.map((p: Player) =>
                            addEmptyPlayer(p)
                        ),
                    });
                }
            }
        } catch (e) {
            alert('Error obteniendo equipo, intente nuevamente');
        }

        changeLoading(false);
    };

    const isMatchValid = (match: Match): boolean => {
        const newHasErrors: MatchErrors = {
            team1: !match.team1,
            team2: !match.team2,
            matchType: !Boolean(matchType),
            date: !isDateValid(match.date),
            round: !match.round,
        };

        setHasErrors(newHasErrors);

        return !Object.values(newHasErrors).includes(true);
    };

    const isDateValid = (date: string): boolean => {
        return (
            Boolean(date) ||
            (Boolean(!dateValueDay?.startDate) && Boolean(!dateValueTime))
        );
    };

    const formatPlayer = ({
        _id,
        pt1,
        pt2,
        pt3,
        fouls,
        assists,
        steals,
        rebounds,
        captain,
        mvp,
    }: Player): Player => {
        return {
            player: _id,
            pt1,
            pt2,
            pt3,
            fouls,
            assists,
            steals,
            rebounds,
            captain,
            mvp,
            totalScore: Number(pt1) + Number(pt2) * 2 + Number(pt3) * 3,
        };
    };

    const sendMatch = async (): Promise<void> => {
        const newMatch: Match = {
            team1: team1?._id,
            team2: team2?._id,
            isPlayoff: subtournament.isPlayoff,
            isTournamentMatch: matchType === 'torneo',
            matchType: matchType !== 'other' ? matchType : otherType,
            location: location ? location : undefined,
            videoUrl: videoUrl.value ? videoUrl.value : undefined,
            playersTeam1: team1?.players.reduce((arr, p) => {
                if (p.isPresent) {
                    arr.push(formatPlayer(p));
                }
                return arr;
            }, []),
            playersTeam2: team2?.players.reduce((arr, p) => {
                if (p.isPresent) {
                    arr.push(formatPlayer(p));
                }
                return arr;
            }, []),
            round,
        };
        if (team1Score !== '') {
            newMatch.team1Score = Number(team1Score);
        }
        if (team2Score !== '') {
            newMatch.team2Score = Number(team2Score);
        }

        // append date if necessary
        if (dateValueDay.startDate && dateValueTime) {
            const timeObj = new Date(`1970-01-01T${dateValueTime}Z`);
            const dateObj = new Date(dateValueDay.startDate);
            // Get the timezone offset in minutes and convert to milliseconds
            const timezoneOffset = 180; // GMT-3 is 180 minutes behind UTC
            const timezoneOffsetMs = timezoneOffset * 60 * 1000;

            // Combine the date and time into a single Date object
            const combinedDate = new Date(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate() + 1,
                timeObj.getHours(),
                timeObj.getMinutes(),
                timeObj.getSeconds()
            );

            // Adjust the combined date to GMT-3 timezone
            const combinedDateInGMT3 = new Date(
                combinedDate.getTime() + timezoneOffsetMs
            );
            newMatch.date = combinedDateInGMT3.toISOString();
        } else if (dateValueDay.startDate) {
            const splitedDate = dateValueDay.startDate.split('-');
            const matchDate = new Date(
                Number(splitedDate[0]),
                Number(splitedDate[1]) - 1,
                Number(splitedDate[2]),
                0,
                0,
                0
            );
            newMatch.date = new Date(matchDate).toISOString();
        }

        console.log(newMatch);
        if (isMatchValid(newMatch)) {
            changeLoading(true);
            // send match
            try {
                const res = await fetch(
                    `${apiUrl}/tournaments/${tournament._id}/subtournaments/${
                        subtournament._id
                    }/matches${match ? `/${match._id}` : ''}`,
                    {
                        method: match ? 'PUT' : 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: AUTH_TOKEN,
                        },
                        body: JSON.stringify({ ...newMatch }),
                    }
                );
                const parsedRes = await res.json();
                if (parsedRes.message) {
                    alert('Error creando partido, intente nuevamente');
                } else {
                    router.push(`/admin/tournamentDetail/${tournament._id}`);
                }
            } catch (err) {
                alert('Error creando partido, intente nuevamente');
            }
        }
        changeLoading(false);
    };

    const formatMatchPlayer = ({
        player,
        totalScore,
        fouls,
        assists,
        rebounds,
        steals,
        captain,
        mvp,
        pt3,
        pt2,
        pt1,
    }: MatchPlayer): Player => {
        return {
            ...player,
            totalScore,
            fouls,
            assists,
            rebounds,
            steals,
            captain,
            mvp,
            pt3,
            pt2,
            pt1,
            isPresent: true,
        };
    };

    const generateTeamPlayers = (
        matchPlayers: MatchPlayer[],
        teamPlayers: Player[]
    ) => {
        const matchPlayersIds: string[] = [];
        const players: Player[] = [];

        matchPlayers.forEach((p) => {
            players.push(formatMatchPlayer(p));
            matchPlayersIds.push(p.player._id);
        });

        return players.concat(
            teamPlayers.filter((p) => !matchPlayersIds.includes(p._id))
        );
    };

    const getTeam = async (id: string, team: number): Promise<void> => {
        try {
            const res = await fetch(
                `${apiUrl}/tournaments/${tournament._id}/teams/${id}`
            );
            const parsedRes = await res.json();
            if (!parsedRes.message) {
                const players = parsedRes.team.players.map((p: Player) =>
                    addEmptyPlayer(p)
                );
                if (team === 1) {
                    setTeam1({
                        ...match.team1,
                        players: generateTeamPlayers(
                            match.playersTeam1,
                            players
                        ),
                    });
                } else {
                    setTeam2({
                        ...match.team2,
                        players: generateTeamPlayers(
                            match.playersTeam2,
                            players
                        ),
                    });
                }
            } else {
                alert('Error obteniendo jugadores, intente nuevamente');
            }
        } catch (err) {
            alert('Error obteniendo jugadores, intente nuevamente');
        }
    };

    useEffect(() => {
        const getTeams = async () => {
            changeLoading(true);
            if (match?.team1?._id) {
                await getTeam(match.team1._id, 1);
            }
            if (match?.team2?._id) {
                await getTeam(match.team2._id, 2);
            }
            changeLoading(false);
        };
        if (match) {
            getTeams();
        }
    }, [match]);

    return (
        <AdminLayout title="Admin - Crear o editar partido">
            <div className="  min-h-screen bg-fondo-blanco">
                <div className="max-w-5xl m-auto">
                    <img
                        src="../images/overtimeLogo_bien.png"
                        alt="logo de overtime"
                        className="m-auto w-16 pt-10"
                    />
                    <div className="flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-center relative">
                        <Link
                            href={'/admin/tournamentDetail/' + tournament._id}
                            className="absolute left-0"
                        >
                            <p className="text-naranja font-bold flex items-center font-din-display uppercase">
                                <img
                                    src="../logos - iconos/Flecha.png"
                                    alt=""
                                    className="w-6 rotate-180"
                                />
                                volver
                            </p>
                        </Link>
                        <div className="m-auto text-center ">
                            <span className="font-Helvetica text-lg text-[#837fa0] font-bold uppercase">
                                {' '}
                                TORNEOS /{' '}
                            </span>{' '}
                            <span className="font-Helvetica text-lg text-[#837fa0] font-bold uppercase">
                                {' '}
                                Torneo /{' '}
                            </span>{' '}
                            <span className="font-Helvetica text-lg text-violeta font-bold uppercase">
                                {' '}
                                crear o editar partido{' '}
                            </span>
                        </div>
                    </div>
                    <div className="max-w-5xl m-auto">
                        <h2 className="font-Fixture-ultra text-8xl uppercase text-center my-3 text-violeta">
                            {' '}
                            crear partido{' '}
                        </h2>

                        <div className="m-auto max-w-5xl flex justify-center my-6">
                            <div>
                                <div className="flex justify-center mt-12">
                                    <div>
                                        <div className="flex justify-center">
                                            <span
                                                className={`text-negro-texto font-bold font-Helvetica uppercase ${
                                                    hasErrors['matchType'] &&
                                                    errorStyle
                                                }`}
                                            >
                                                tipo de partido
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-12 font-din-display ">
                                            <div className="flex gap-3 items-center my-5">
                                                <button
                                                    className={`w-5 h-5 rounded-full border-violeta border ${
                                                        matchType ===
                                                            'torneo' &&
                                                        'bg-violeta'
                                                    }`}
                                                    onClick={() =>
                                                        setMatchType('torneo')
                                                    }
                                                ></button>
                                                <span className="uppercase text-violeta font-bold">
                                                    Torneo
                                                </span>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <button
                                                    className={`w-5 h-5 rounded-full border-violeta border ${
                                                        matchType ===
                                                            'amistoso' &&
                                                        'bg-violeta'
                                                    }`}
                                                    onClick={() =>
                                                        setMatchType('amistoso')
                                                    }
                                                ></button>
                                                <span className="uppercase text-violeta font-bold">
                                                    amistoso
                                                </span>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <button
                                                    className={`w-5 h-5 rounded-full border-violeta border ${
                                                        matchType !==
                                                            'torneo' &&
                                                        matchType !==
                                                            'amistoso' &&
                                                        'bg-violeta'
                                                    }`}
                                                    onClick={() =>
                                                        setMatchType('other')
                                                    }
                                                ></button>
                                                <input
                                                    type="text"
                                                    placeholder="otro"
                                                    className={`uppercase border rounded-md px-4 py-2 ring-2 ring-${
                                                        matchType !==
                                                            'torneo' &&
                                                        matchType !== 'amistoso'
                                                            ? 'violeta'
                                                            : 'gray-400'
                                                    } w-40 `}
                                                    value={otherType}
                                                    onChange={(e) =>
                                                        setOtherType(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="justify-center m-auto flex mt-12">
                                    <select
                                        name=""
                                        className="bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-64 focus:border-naranja block py-2.5 px-8"
                                        id="tipoDeTorneo"
                                        defaultValue="fecha"
                                        onChange={(e) =>
                                            setRound(e.target.value)
                                        }
                                        value={round}
                                    >
                                        <option
                                            className="font-bold p-2"
                                            disabled
                                            value=""
                                        >
                                            Fecha {hasErrors['round'] && ' *'}
                                        </option>
                                        {subtournament.isPlayoff &&
                                        subtournament.playoffConfig?.datesNames
                                            ?.length === 0
                                            ? subtournament.playoffConfig.datesNames.map(
                                                  (
                                                      date: string,
                                                      idx: number
                                                  ) => (
                                                      <option
                                                          className="font-bold p-2"
                                                          value={date}
                                                          key={idx}
                                                      >
                                                          {date}
                                                      </option>
                                                  )
                                              )
                                            : [...Array(100)].map(
                                                  (item: any, idx: number) => (
                                                      <option
                                                          className="font-bold p-2"
                                                          value={idx + 1}
                                                          key={idx}
                                                      >
                                                          Fecha {idx + 1}
                                                      </option>
                                                  )
                                              )}
                                    </select>
                                </div>

                                <div className="flex justify-center gap-4 mt-12">
                                    <div className="flex flex-col items-center relative">
                                        <span
                                            className={`font-bold font-Helvetica text-center m-auto uppercase mb-3 ${
                                                hasErrors['team1'] && errorStyle
                                            }`}
                                        >
                                            equipo 1
                                        </span>
                                        <TeamPickerDropdown
                                            teams={subtournament.teams.concat(
                                                subtournament.teams2
                                            )}
                                            onChange={(team) =>
                                                handleTeamChange(team._id, 1)
                                            }
                                            value={team1}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold font-Helvetica text-center m-auto uppercase mb-3">
                                            pts
                                        </span>
                                        <input
                                            type="number"
                                            name="team1score"
                                            id="team1score"
                                            placeholder="-"
                                            value={
                                                team1Score !== ''
                                                    ? team1Score
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setTeam1Score(e.target.value)
                                            }
                                            className="text-center bg-transparent border-opacity-80 px-3 py-2 border border-black rounded-md w-12"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold font-Helvetica text-center m-auto uppercase mb-3">
                                            pts
                                        </span>
                                        <input
                                            type="number"
                                            name="team2score"
                                            id="team2score"
                                            placeholder="-"
                                            value={
                                                team2Score !== ''
                                                    ? team2Score
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setTeam2Score(e.target.value)
                                            }
                                            className="text-center bg-transparent border-opacity-80 px-3 py-2 border border-black rounded-md w-12"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center relative">
                                        <span
                                            className={`font-bold font-Helvetica text-center m-auto uppercase mb-3 ${
                                                hasErrors['team2'] && errorStyle
                                            }`}
                                        >
                                            equipo 2
                                        </span>
                                        <TeamPickerDropdown
                                            teams={subtournament.teams.concat(
                                                subtournament.teams2
                                            )}
                                            onChange={(team) =>
                                                handleTeamChange(team._id, 2)
                                            }
                                            value={team2}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-6 mt-12">
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-center text-negro-texto font-bold font-Helvetica uppercase ${
                                                hasErrors['date'] && errorStyle
                                            }`}
                                        >
                                            dia
                                        </span>
                                        <div className="w-52 ">
                                            <Datepicker
                                                primaryColor="red"
                                                containerClassName=" border-2 rounded-md  bg-blanco"
                                                inputClassName="font-normal bg-blanco dark:bg-blanco dark:placeholder:text-negro dark:text-negro"
                                                placeholder={'Fecha'}
                                                asSingle={true}
                                                useRange={false}
                                                value={dateValueDay}
                                                onChange={
                                                    handleDateValueDayChange
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-center text-negro-texto font-bold font-Helvetica uppercase ${
                                                hasErrors['date'] && errorStyle
                                            }`}
                                        >
                                            hora
                                        </span>
                                        <input
                                            type="time"
                                            className=" w-52 text-center p-1.5 border-2   rounded-md "
                                            onChange={(e) =>
                                                handleDateValueTimeChange(
                                                    e.target.value
                                                )
                                            }
                                            value={dateValueTime}
                                        ></input>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-center text-negro-texto font-bold font-Helvetica uppercase">
                                            lugar
                                        </span>
                                        <input
                                            type="text"
                                            className="w-52 h-10 rounded-md p-1.5"
                                            onChange={(e) =>
                                                setLocation(e.target.value)
                                            }
                                            value={location}
                                        ></input>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className=" flex flex-col justify-center">
                            <div className=" flex justify-center mt-12">
                                <span className=" uppercase  font-Helvetica font-bold">
                                    JUGADORES EQUIPO 1
                                </span>
                            </div>
                            {team1 && (
                                <div className="mt-2 m-auto  font-din-display table w-4/5 ">
                                    <div className="table-header-group">
                                        <div className="table-row">
                                            <div className="table-cell pr-6 text-left mb-3"></div>
                                            <div className="table-cell text-left p pb-3x-3">
                                                Nombre
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                Presente
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                Capitán
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                MVP
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                FAL
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                ROB
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                REB
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                AS
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                1PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                2PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                3PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                PTS
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-row-group">
                                        {team1.players.map((p, i) => (
                                            <div className=" bg-blanco p-4 rounded-full table-row">
                                                <div className="table-cell p-5 rounded-lg relative ">
                                                    <img
                                                        src={`${IMAGE_URL}/${p.picture}`}
                                                        className="w-6  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
                                                    />
                                                </div>
                                                <div>
                                                    <span className="font-bold">
                                                        {p.name}
                                                    </span>
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-5 h-5 rounded-md border-violeta m-auto   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.isPresent &&
                                                            'bg-violeta'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'isPresent',
                                                                !p.isPresent,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-4 h-4 rounded-full border-violeta m-auto  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.captain
                                                                ? 'bg-violeta'
                                                                : ''
                                                        } 
                                                        ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'captain',
                                                                !p.captain,
                                                                1
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-4 h-4 rounded-full border-violeta m-auto  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.mvp &&
                                                            'bg-violeta'
                                                        }
                                                        ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'mvp',
                                                                !p.mvp,
                                                                1
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className="table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="fouls"
                                                        value={p.fouls || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'fouls',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="steals"
                                                        value={p.steals || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'steals',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="rebounds"
                                                        value={p.rebounds || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'rebounds',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="assists"
                                                        value={p.assists || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'assists',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt1"
                                                        value={p.pt1 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt1',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt2"
                                                        value={p.pt2 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt2',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt3"
                                                        value={p.pt3 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt3',
                                                                e.target.value,
                                                                1
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="text"
                                                        name="points"
                                                        placeholder={
                                                            p.isPresent
                                                                ? '0'
                                                                : ''
                                                        }
                                                        className="text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 bg-gris"
                                                        value={
                                                            p.isPresent
                                                                ? getPlayerTotalPoints(
                                                                      p._id,
                                                                      1
                                                                  )
                                                                : '-'
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className=" flex flex-col justify-center">
                            <div className=" flex justify-center mt-12">
                                <span className=" uppercase  font-Helvetica font-bold">
                                    JUGADORES EQUIPO 2
                                </span>
                            </div>
                            {team2 && (
                                <div className="mt-2 m-auto  font-din-display table w-4/5 ">
                                    <div className="table-header-group">
                                        <div className="table-row">
                                            <div className="table-cell pr-6 text-left mb-3"></div>
                                            <div className="table-cell text-left p pb-3x-3">
                                                Nombre
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                Presente
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                Capitán
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                MVP
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                FAL
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                ROB
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                REB
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                AS
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                1PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                2PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                3PT
                                            </div>
                                            <div className="table-cell text-center pb-2 px-2">
                                                PTS
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-row-group">
                                        {team2.players.map((p, i) => (
                                            <div className=" bg-blanco p-4 rounded-full table-row">
                                                <div className="table-cell p-5 rounded-lg relative ">
                                                    <img
                                                        src={`${IMAGE_URL}/${p.picture}`}
                                                        className="w-6  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
                                                    />
                                                </div>
                                                <div>
                                                    <span className="font-bold">
                                                        {p.name}
                                                    </span>
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-5 h-5 rounded-md border-violeta m-auto   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.isPresent &&
                                                            'bg-violeta'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'isPresent',
                                                                !p.isPresent,
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-4 h-4 rounded-full border-violeta m-auto  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.captain
                                                                ? 'bg-violeta'
                                                                : ''
                                                        } 
                                                        ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'captain',
                                                                !p.captain,
                                                                2
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" relative  table-cell  text-center ">
                                                    <button
                                                        className={`w-4 h-4 rounded-full border-violeta m-auto  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border ${
                                                            p.mvp &&
                                                            'bg-violeta'
                                                        }
                                                        ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onClick={() =>
                                                            updatePlayer(
                                                                p._id,
                                                                'mvp',
                                                                !p.mvp,
                                                                2
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className="table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="fouls"
                                                        value={p.fouls || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'fouls',
                                                                e.target.value,
                                                                2
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="steals"
                                                        value={p.steals || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'steals',
                                                                e.target.value,
                                                                2
                                                            )
                                                        }
                                                        disabled={!p.isPresent}
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="rebounds"
                                                        value={p.rebounds || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'rebounds',
                                                                e.target.value,
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1">
                                                    <input
                                                        type="number"
                                                        name="assists"
                                                        value={p.assists || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'assists',
                                                                e.target.value,
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt1"
                                                        value={p.pt1 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt1',
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt2"
                                                        value={p.pt2 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt2',
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        name="pt3"
                                                        value={p.pt3 || ''}
                                                        placeholder="0"
                                                        className={`text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 ${
                                                            !p.isPresent &&
                                                            'bg-gris'
                                                        }`}
                                                        disabled={!p.isPresent}
                                                        onChange={(e) =>
                                                            updatePlayer(
                                                                p._id,
                                                                'pt3',
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                                2
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className=" py-2 table-cell p-1 rounded-lg">
                                                    <input
                                                        type="text"
                                                        name="points"
                                                        placeholder={
                                                            p.isPresent
                                                                ? '0'
                                                                : ''
                                                        }
                                                        className="text-center bg-transparent opacity-80 p-1.5 border border-black rounded-md w-10 mx-1 bg-gris"
                                                        value={
                                                            p.isPresent
                                                                ? getPlayerTotalPoints(
                                                                      p._id,
                                                                      2
                                                                  )
                                                                : '-'
                                                        }
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="  flex flex-col gap-3 items-center mt-12">
                            <span
                                className={` uppercase  font-Helvetica font-bold ${
                                    hasErrors['playersTeam1'] && errorStyle
                                }`}
                            >
                                URL A Youtube
                            </span>
                            <div className="">
                                <TextField
                                    placeholder="URL"
                                    value={videoUrl.value}
                                    isEditing={videoUrl.isEditing}
                                    handleEdit={(value) =>
                                        setVideoUrl({
                                            ...videoUrl,
                                            isEditing: value,
                                        })
                                    }
                                    onChange={(e) =>
                                        setVideoUrl({
                                            ...videoUrl,
                                            value: e.target.value,
                                        })
                                    }
                                    className="text-center text-blue-900 font-din-display  my-3 bg-fondo-blanco w-72 p-1"
                                />
                            </div>
                            <Link
                                href={videoUrl.value}
                                target="_blank"
                                className="mx-auto px-10 py-2 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display text-blanco "
                            >
                                Preview
                            </Link>
                        </div>

                        <div className="flex gap-2 justify-center mt-24">
                            <button
                                className="px-10 py-2 border-naranja border-2 text-naranja font-bold uppercase rounded-md font-din-display mb-12"
                                onClick={() =>
                                    router.push(
                                        `/admin/tournamentDetail/${tournament._id}`
                                    )
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-10 py-2 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display mb-12 text-blanco"
                                onClick={() => sendMatch()}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export async function getServerSideProps(context) {
    let data = {
        match: null,
        subtournament: null,
    };
    data.subtournament = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.subtournament}`
    ).then((response) => response.json());
    if (context.query.match) {
        const matchRes = await fetch(
            `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.subtournament}/matches/${context.query.match}`
        );
        data.match = await matchRes.json();
    }
    const subtournament: Subtournament = data.subtournament.subtournament;
    const tournament: Tournament = data.subtournament.tournament;

    return {
        props: {
            match: data.match?._id ? data.match : null,
            subtournament,
            tournament,
        },
    };
}

export default CrearPartido;
