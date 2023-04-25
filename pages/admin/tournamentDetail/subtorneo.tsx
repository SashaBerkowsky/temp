import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Tournament, Subtournament } from '@types';
import { TextField } from '../../../components';
import { useLoading } from '@context/LoadingContext';
import { AUTH_TOKEN, IMAGE_URL } from '@constants';
import apiUrl from '../../../constants/apiUrl';
import AdminLayout from '@components/Admin/AdminLayout';

type SubtournamentProps = {
    tournament: Tournament;
    editSubtournament: Subtournament;
    teamsIDs: string[];
    teams2IDs: string[];
};

type SubtournamentErrors = {
    name: boolean;
    isPlayoff: boolean;
    playoffDates: {
        32: boolean;
        16: boolean;
        8: boolean;
        4: boolean;
        2: boolean;
    };
};

const getEmptyPlayoffDates = (teams?: number) => {
    return {
        32: {
            isAvailable: !teams || teams >= 32,
            isEditing: false,
            value: '16avos',
        },
        16: {
            isAvailable: !teams || teams >= 16,
            isEditing: false,
            value: 'octavos',
        },
        8: {
            isAvailable: !teams || teams >= 8,
            isEditing: false,
            value: 'cuartos',
        },

        4: {
            isAvailable: !teams || teams >= 4,
            isEditing: false,
            value: 'semis',
        },
        2: {
            isAvailable: !teams || teams >= 2,
            isEditing: false,
            value: 'final',
        },
    };
};

const subTournament = ({
    editSubtournament,
    tournament,
    teamsIDs,
    teams2IDs,
}: SubtournamentProps) => {
    const errorStyle: string =
        'underline underline-offset-4 decoration-naranja decoration-4';

    const loadPlayoffDates = () => {
        const emptyPlayoffDates = getEmptyPlayoffDates(
            editSubtournament?.playoffConfig?.teams
        );

        if (editSubtournament?.playoffConfig?.datesNames) {
            const datesLength =
                editSubtournament.playoffConfig.datesNames.length;
            editSubtournament.playoffConfig.datesNames.forEach((date, idx) => {
                emptyPlayoffDates[2 ** (datesLength - idx)] = {
                    isAvailable: true,
                    isEditing: false,
                    value: date,
                };
            });
        }

        return emptyPlayoffDates;
    };

    const router = useRouter();
    const { changeLoading } = useLoading();

    const [name, setName] = useState({
        value: editSubtournament?.name ? editSubtournament.name : '',
        isEditing: false,
    });
    const [subtournamentType, setSubtournamentType] = useState<string>(
        !editSubtournament
            ? ''
            : editSubtournament.isPlayoff
            ? 'playoff'
            : 'torneo'
    );
    const [isPlayoff, setIsPlayoff] = useState<boolean>(
        editSubtournament?.isPlayoff ? editSubtournament.isPlayoff : false
    );
    const [teams, setTeams] = useState<string[]>(
        editSubtournament?.teams ? teamsIDs : []
    );
    const [teams2, setTeams2] = useState<string[]>(
        editSubtournament?.teams2 ? teams2IDs : []
    );
    const [zones, setZones] = useState<boolean>(
        editSubtournament?.zones || false
    );
    const handleZones = (): void => setZones(!zones);

    const [playoffDates, setPlayoffDates] = useState(loadPlayoffDates());
    const [invalidFields, setInvalidFields] = useState<SubtournamentErrors>({
        isPlayoff: false,
        name: false,
        playoffDates: {
            32: false,
            16: false,
            8: false,
            4: false,
            2: false,
        },
    });
    const [teamAmount, setTeamAmount] = useState<number>(
        editSubtournament?.playoffConfig?.teams
            ? editSubtournament.playoffConfig.teams
            : 32
    );

    const handlePlayoffEdit = (
        playoff: number,
        field: string,
        value: boolean | string
    ): void => {
        const newPlayoff = {
            ...playoffDates[playoff],
            [field]: value,
        };
        setPlayoffDates({ ...playoffDates, [playoff]: newPlayoff });
    };
    const handleTeamAmount = (amount: number): void => {
        const newPlayoffDates = playoffDates;
        Object.keys(newPlayoffDates).map(
            (key) =>
                (newPlayoffDates[key] = {
                    ...newPlayoffDates[key],
                    isAvailable: parseInt(key) <= amount,
                })
        );
        setTeamAmount(amount);
        setPlayoffDates({ ...newPlayoffDates });
    };

    const hasError = (): boolean => {
        const hasErrors: SubtournamentErrors = {
            isPlayoff: subtournamentType === '',
            name: name.value === '',
            playoffDates: {
                32: false,
                16: false,
                8: false,
                4: false,
                2: false,
            },
        };

        if (!hasErrors.isPlayoff && isPlayoff) {
            for (const key in hasErrors.playoffDates) {
                hasErrors.playoffDates[key] = playoffDates[key].value === '';
            }
        }

        setInvalidFields(hasErrors);

        return Object.values(hasErrors).includes(true);
    };

    const addPlayoffDates = (subtournament: Subtournament): void => {
        const datesNames: string[] = [];
        const playoffKeys = Object.keys(playoffDates).sort(
            (a, b) => Number(b) - Number(a)
        );
        playoffKeys.forEach((key) => {
            if (playoffDates[key].isAvailable) {
                datesNames.push(playoffDates[key].value);
            }
        });
        subtournament.playoffConfig = {
            datesNames,
            teams: teamAmount,
        };
    };

    async function sendSubtournament(): Promise<void> {
        if (!hasError()) {
            const subtournament: Subtournament = {
                teams,
                teams2: zones ? teams2 : [],
                isPlayoff,
                zones,
                name: name.value,
            };
            if (isPlayoff) {
                addPlayoffDates(subtournament);
            }
            changeLoading(true);
            try {
                const res = await fetch(
                    `${apiUrl}/tournaments/${tournament._id}/subtournaments${
                        editSubtournament ? `/${editSubtournament._id}` : ''
                    }`,
                    {
                        method: `${editSubtournament ? 'PUT' : 'POST'}`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: AUTH_TOKEN,
                        },
                        body: JSON.stringify({ ...subtournament }),
                    }
                );
                const subtournamentRes = await res.json();
                if (!subtournamentRes.message) {
                    router.push(`/admin/tournamentDetail/${tournament._id}`);
                } else {
                    alert(
                        `Error creando ${
                            editSubtournament ? 'editando' : 'creando'
                        } subtorneo, intente nuevamente`
                    );
                }
            } catch (err) {
                alert(
                    `Error creando ${
                        editSubtournament ? 'editando' : 'creando'
                    } subtorneo, intente nuevamente`
                );
            }
            changeLoading(false);
        }
    }

    const handleAddTeam = (idTeam: string, isTeam2?: boolean) => {
        if (isTeam2) {
            if (!teams2.includes(idTeam)) {
                setTeams2([...teams2, idTeam]);
            } else {
                const newTeams = teams2.filter((t) => idTeam !== t);
                setTeams2([...newTeams]);
            }
        } else {
            if (!teams.includes(idTeam)) {
                setTeams([...teams, idTeam]);
            } else {
                const newTeams = teams.filter((t) => idTeam !== t);
                setTeams([...newTeams]);
            }
        }
    };

    const handleIsPlayoff = (value: string) => {
        setIsPlayoff(value === 'playoff');
        setSubtournamentType(value);
    };

    return (
        <AdminLayout title="Admin - Subtorneo">
            <div className="bg-fondo-blanco min-h-screen">
                <img
                    src="../../../images/overtimeLogo_bien.png"
                    alt="logo de overtime"
                    className="m-auto w-14 pt-6"
                />
                <div className="flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-between">
                    <Link href="/admin/torneos">
                        <p className="text-naranja font-bold text-sm flex items-center font-din-display uppercase">
                            <img
                                src="../../../logos - iconos/Flecha.png"
                                alt=""
                                className="w-4 rotate-180"
                            />
                            volver &nbsp;{' '}
                            <span className="hidden md:block"> al torneo </span>
                        </p>
                    </Link>
                    <div className="m-auto text-center">
                        <span className="font-Helvetica text-md text-[#837fa0] font-bold">
                            TORNEOS /{' '}
                        </span>
                        <span className="font-Helvetica text-md text-[#837fa0] font-bold uppercase">
                            {' '}
                            {tournament.name} /{' '}
                        </span>
                        <span className="font-Helvetica text-md text-violeta font-bold uppercase">
                            {' '}
                            crear o editar subtorneo{' '}
                        </span>
                    </div>
                    <div className="w-32"></div>
                </div>

                <div className="text-9xl text-center m-auto my-12 uppercase font-Fixture-ultra text-violeta">
                    {editSubtournament?.name || 'nuevo subtourneo'}
                </div>

                <div className="flex justify-center text-center">
                    <div>
                        <span
                            className={`text-negro-texto font-bold font-Helvetica uppercase ${
                                invalidFields['name'] && errorStyle
                            }`}
                        >
                            nombre
                        </span>
                        <TextField
                            placeholder="nombre"
                            value={name.value}
                            isEditing={name.isEditing}
                            handleEdit={(value) =>
                                setName({ ...name, isEditing: value })
                            }
                            onChange={(e) =>
                                setName({ ...name, value: e.target.value })
                            }
                            className="text-center text-negro-texto font-din-display uppercase my-3 bg-fondo-blanco"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-10 mb-8 font-din-display">
                    <div>
                        <select
                            className={`bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-64 focus:border-naranja block py-2.5 px-8 ${
                                invalidFields['isPlayoff'] && errorStyle
                            }`}
                            id="tipoDeTorneo"
                            defaultValue="Tipo de torneo"
                            onChange={(e) => handleIsPlayoff(e.target.value)}
                            value={subtournamentType}
                        >
                            <option
                                className="font-bold p-2"
                                selected
                                disabled
                                value=""
                            >
                                Tipo de torneo
                            </option>
                            <option className="font-bold p-2" value="torneo">
                                Torneo
                            </option>
                            <option className="font-bold p-2" value="playoff">
                                Playoff
                            </option>
                        </select>
                        {isPlayoff ? (
                            <select
                                className="bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-64 focus:border-naranja block py-2.5 px-8 mt-4"
                                id="cantidadDeEquipos"
                                defaultValue="Cantidad de Equipos"
                                onChange={(e) => {
                                    handleTeamAmount(parseInt(e.target.value));
                                }}
                                value={teamAmount}
                            >
                                <option className="font-bold p-2" disabled>
                                    Cantidad de Equipos
                                </option>
                                <option className="font-bold p-2" value={32}>
                                    32
                                </option>
                                <option className="font-bold p-2" value={16}>
                                    16
                                </option>
                                <option className="font-bold p-2" value={8}>
                                    8
                                </option>
                                <option className="font-bold p-2" value={4}>
                                    4
                                </option>
                            </select>
                        ) : (
                            <div className="flex gap-2 justify-center w-32 py-0.5 mx-auto mt-4 border-2 border-naranja text-naranja rounded-md bg-blanco ">
                                <input
                                    className="h-4 mt-2"
                                    type="checkbox"
                                    checked={zones}
                                    onChange={handleZones}
                                />
                                <div className="font-bold text-md uppercase mt-[6px] ">
                                    zonas
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {isPlayoff && (
                    <div>
                        <div className="flex justify-center">
                            <div>
                                <span
                                    className={`text-negro-texto font-bold font-Helvetica uppercase ${
                                        Object.values(
                                            invalidFields['playoffDates']
                                        ).includes(true) && errorStyle
                                    }`}
                                >
                                    NOMBRE DE LAS FECHAS DE PLAYOFF
                                </span>
                            </div>
                        </div>
                        <div className="w-1/3 flex gap-2 font-din-display justify-center mt-10 mx-auto">
                            {playoffDates[32].isAvailable && (
                                <div className="w-42">
                                    <div className="text-center uppercase m-auto font-bold text-violeta text-sm flex justify-center  items-center">
                                        <TextField
                                            variant="sm"
                                            placeholder="nombre"
                                            value={playoffDates[32].value}
                                            isEditing={
                                                playoffDates[32].isEditing
                                            }
                                            handleEdit={(value) =>
                                                handlePlayoffEdit(
                                                    32,
                                                    'isEditing',
                                                    value
                                                )
                                            }
                                            onChange={(e) =>
                                                handlePlayoffEdit(
                                                    32,
                                                    'value',
                                                    e.target.value
                                                )
                                            }
                                            className="font-bold text-sm text-center text-violeta font-din-display uppercase bg-fondo-blanco"
                                        />
                                    </div>
                                    <div className="mt-2 relative">
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="text-3xl font-bold text-negro-texto font-din-display">
                                                {' '}
                                                X32{' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {playoffDates[16].isAvailable && (
                                <div className="w-42">
                                    <div className="text-center uppercase m-auto font-bold text-violeta text-sm flex justify-center  items-center">
                                        <TextField
                                            variant="sm"
                                            placeholder="nombre"
                                            value={playoffDates[16].value}
                                            isEditing={
                                                playoffDates[16].isEditing
                                            }
                                            handleEdit={(value) =>
                                                handlePlayoffEdit(
                                                    16,
                                                    'isEditing',
                                                    value
                                                )
                                            }
                                            onChange={(e) =>
                                                handlePlayoffEdit(
                                                    16,
                                                    'value',
                                                    e.target.value
                                                )
                                            }
                                            className="font-bold text-sm text-center text-violeta font-din-display uppercase bg-fondo-blanco"
                                        />
                                    </div>
                                    <div className="mt-2 relative">
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="text-3xl font-bold text-negro-texto font-din-display">
                                                {' '}
                                                X16{' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {playoffDates[8].isAvailable && (
                                <div className="w-42">
                                    <div className="text-center uppercase m-auto font-bold text-violeta text-sm flex justify-center  items-center">
                                        <TextField
                                            variant="sm"
                                            placeholder="nombre"
                                            value={playoffDates[8].value}
                                            isEditing={
                                                playoffDates[8].isEditing
                                            }
                                            handleEdit={(value) =>
                                                handlePlayoffEdit(
                                                    8,
                                                    'isEditing',
                                                    value
                                                )
                                            }
                                            onChange={(e) =>
                                                handlePlayoffEdit(
                                                    8,
                                                    'value',
                                                    e.target.value
                                                )
                                            }
                                            className="font-bold text-sm text-center text-violeta font-din-display uppercase bg-fondo-blanco"
                                        />
                                    </div>
                                    <div className="mt-2 relative">
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="text-3xl font-bold text-negro-texto font-din-display">
                                                {' '}
                                                X8{' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {playoffDates[4].isAvailable && (
                                <div className="w-42">
                                    <div className="text-center uppercase m-auto font-bold text-violeta text-sm flex justify-center  items-center">
                                        <TextField
                                            variant="sm"
                                            placeholder="nombre"
                                            value={playoffDates[4].value}
                                            isEditing={
                                                playoffDates[4].isEditing
                                            }
                                            handleEdit={(value) =>
                                                handlePlayoffEdit(
                                                    4,
                                                    'isEditing',
                                                    value
                                                )
                                            }
                                            onChange={(e) =>
                                                handlePlayoffEdit(
                                                    4,
                                                    'value',
                                                    e.target.value
                                                )
                                            }
                                            className="font-bold text-sm text-center text-violeta font-din-display uppercase bg-fondo-blanco"
                                        />
                                    </div>
                                    <div className="mt-2 relative">
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <span className="text-3xl font-bold text-negro-texto font-din-display">
                                                {' '}
                                                X4{' '}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="w-42">
                                <div className="text-center uppercase m-auto font-bold text-violeta text-sm flex justify-center  items-center">
                                    <TextField
                                        variant="sm"
                                        placeholder="nombre"
                                        value={playoffDates[2].value}
                                        isEditing={playoffDates[2].isEditing}
                                        handleEdit={(value) =>
                                            handlePlayoffEdit(
                                                2,
                                                'isEditing',
                                                value
                                            )
                                        }
                                        onChange={(e) =>
                                            handlePlayoffEdit(
                                                2,
                                                'value',
                                                e.target.value
                                            )
                                        }
                                        className="font-bold text-sm text-center text-violeta font-din-display uppercase bg-fondo-blanco"
                                    />
                                </div>
                                <div className="mt-2 relative">
                                    <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                    <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                    <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                    <div className="w-24 mt-[2px] h-5 rounded-sm bg-gris-admin"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="text-3xl font-bold text-negro-texto font-din-display">
                                            {' '}
                                            X2{' '}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center ">
                    <div className="my-6 mx-auto">
                        <div className="flex justify-center">
                            <span className="text-negro-texto font-bold font-Helvetica uppercase ">
                                {zones ? 'zona a' : 'equipos'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-12">
                            {tournament?.teams.length > 0 ? (
                                tournament?.teams.map((i, index) => (
                                    <div
                                        className={`bg-blanco flex justify-start items-center gap-1 py-2 px-3 rounded-md ${
                                            teams.includes(i._id)
                                                ? 'bg-[#4e4585] bg-opacity-10'
                                                : 'bg-blanco'
                                        }`}
                                        key={index}
                                    >
                                        <button
                                            className={`w-4 h-4 rounded-md border ${
                                                teams.includes(i._id)
                                                    ? 'bg-violeta border-violeta'
                                                    : 'border-negro-texto'
                                            }`}
                                            onClick={() => handleAddTeam(i._id)}
                                        ></button>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`${IMAGE_URL}/${i.badge}`}
                                                width="40px"
                                            ></img>
                                            <h6 className="font-din-display text-negro-texto font-bold opacity-80 uppercase">
                                                {i.name}
                                            </h6>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay equipos en el torneo</p>
                            )}
                        </div>
                    </div>
                </div>
                {zones && (
                    <div className="flex justify-center ">
                        <div className="my-6 mx-auto">
                            <div className="flex justify-center">
                                <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                    zona b
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-12">
                                {tournament?.teams.length > 0 ? (
                                    tournament?.teams.map((i, index) => (
                                        <div
                                            className={`bg-blanco flex justify-start items-center gap-1 py-2 px-3 rounded-md ${
                                                teams2.includes(i._id)
                                                    ? 'bg-[#4e4585] bg-opacity-10'
                                                    : 'bg-blanco'
                                            }`}
                                            key={index}
                                        >
                                            <button
                                                className={`w-4 h-4 rounded-md border ${
                                                    teams2.includes(i._id)
                                                        ? 'bg-violeta border-violeta'
                                                        : 'border-negro-texto'
                                                }`}
                                                onClick={() =>
                                                    handleAddTeam(i._id, true)
                                                }
                                            ></button>
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={`${IMAGE_URL}/${i.badge}`}
                                                    width="40px"
                                                ></img>
                                                <h6 className="font-din-display text-negro-texto font-bold opacity-80 uppercase">
                                                    {i.name}
                                                </h6>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay equipos en el torneo</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex gap-2 justify-center mt-12">
                    <button
                        className="px-10 py-2 border-naranja border-2 text-naranja font-bold uppercase rounded-md font-din-display mb-24"
                        onClick={() =>
                            router.push(
                                `/admin/tournamentDetail/${tournament._id}`
                            )
                        }
                    >
                        {' '}
                        Cancelar
                    </button>
                    <button
                        className="px-10 py-2 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display mb-24 text-blanco"
                        onClick={() => sendSubtournament()}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default subTournament;

export async function getServerSideProps(context) {
    const res = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}${
            context.query.subtournament
                ? `/subtournaments/${context.query.subtournament}`
                : ''
        }`
    );
    const data = await res.json();
    const teamsIDs = data.subtournament?.teams.map(({ _id }): string => _id);
    const teams2IDs = data.subtournament?.teams2.map(({ _id }): string => _id);
    return {
        props: data.subtournament
            ? {
                  tournament: data.tournament,
                  editSubtournament: data.subtournament,
                  teamsIDs,
                  teams2IDs,
              }
            : { tournament: data },
    };
}
