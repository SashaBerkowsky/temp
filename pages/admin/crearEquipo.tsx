import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ModalConfirm, TextField } from '@components/index';
import { Tournament, Team, Player } from '@types';
import { useLoading } from '@context/LoadingContext';
import { AUTH_TOKEN, IMAGE_URL } from '@constants';
import apiUrl from '../../constants/apiUrl';
import AdminLayout from '@components/Admin/AdminLayout';

type PlayerField = {
    _id?: string;
    isEditing: boolean;
    name: string;
    picture: string;
};

type PlayerRes = {
    player: Player;
    isEdited: boolean;
};

type Props = {
    tournament: Tournament;
    team: Team;
};

export default function CrearEquipo({ tournament, team }: Props) {
    const errorStyle: string =
        'underline underline-offset-4 decoration-naranja decoration-4';

    const getEmptyPlayer = (playerNumber: number): PlayerField => {
        return {
            isEditing: false,
            name: 'Jugador ' + playerNumber,
            picture: 'defaultPlayer.png',
        };
    };

    const loadPlayers = (): PlayerField[] => {
        let myPlayers = [];

        if (team?.players) {
            team.players.forEach((p: Player) =>
                myPlayers.push({
                    isEditing: false,
                    name: p.name,
                    picture: p.picture,
                    _id: p._id,
                })
            );
        }
        return myPlayers;
    };

    const router = useRouter();
    const { changeLoading } = useLoading();

    const imageInputRef = useRef(null);

    const [errorFields, setErrorFields] = useState({});

    const [deletePlayer, setDeletePlayer] = useState<Player>(null);

    const [imageInputData, setImageInputData] = useState({
        target: '',
        playerIdx: 0,
    });

    // team data
    const [teamName, setTeamName] = useState({
        value: team?.name ? team.name : '',
        isEditing: false,
    });
    const [badge, setBadge] = useState(
        team?.badge ? team.badge : 'defaultBadge.png'
    );
    const [teamPicture, setTeamPicture] = useState(
        team?.teamPicture ? team?.teamPicture : 'defaultTeam.png'
    );
    const [delegatePicture, setDelegatePicture] = useState(
        team?.delegatePicture ? team?.delegatePicture : 'defaultDelegate.png'
    );
    const [players, setPlayers] = useState<PlayerField[]>(loadPlayers());
    const [subtournaments, setSubtournaments] = useState<string[]>(
        team?.subtournaments ? team.subtournaments : []
    );

    const handlePlayerChange = (value: string, idx: number): void => {
        const newPlayers = players;
        newPlayers[idx].name = value;

        setPlayers(newPlayers.splice(0, newPlayers.length));
    };

    const handlePlayerEdit = (value: boolean, idx: number): void => {
        const newPlayers = players;
        newPlayers[idx].isEditing = value;

        setPlayers(newPlayers.splice(0, newPlayers.length));
    };

    const handlePlayerPic = (picture: string): void => {
        const newPlayers = players;
        newPlayers[imageInputData.playerIdx].picture = picture;

        setPlayers(newPlayers.splice(0, newPlayers.length));
    };

    const handleAddSubtournament = (idSubtournament: string): void => {
        if (!subtournaments.includes(idSubtournament)) {
            setSubtournaments([...subtournaments, idSubtournament]);
        } else {
            setSubtournaments(
                subtournaments.filter((id) => id !== idSubtournament)
            );
        }
    };

    const handleImgInput = async (files: FileList) => {
        const fileReader = new FileReader();

        fileReader.onload = async (e) => {
            try {
                const b64 = e.target.result;
                const imageType = files[0].name.split('.').pop();

                const apiResponse = await fetch(`${apiUrl}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: AUTH_TOKEN,
                    },
                    body: JSON.stringify({ b64, imageType }),
                });

                const imageResponse = await apiResponse.json();
                if (!imageResponse.message) {
                    addImageUrl(imageResponse?.path);
                }
            } catch (err) {
                alert('Error subiendo imagen, intente nuevamente');
            }
        };

        fileReader.readAsDataURL(files[0]);
    };

    const addImageUrl = (imgUrl: string): void => {
        const { target } = imageInputData;

        imageSetters[target]?.(imgUrl);
    };

    const imageSetters = {
        badge: setBadge,
        teamPicture: setTeamPicture,
        delegatePicture: setDelegatePicture,
        player: handlePlayerPic,
    };

    const openImgInput = (target: string, playerIdx?: number): void => {
        setImageInputData({ target, playerIdx });
        imageInputRef.current.click();
    };

    const handleSubmit = async () => {
        const teamForm: Team = {
            badge,
            teamPicture,
            name: teamName.value,
            subtournaments,
            delegatePicture,
        };
        const hasError = {
            name: teamName.value === '',
        };
        const isTeamInvalid = Object.keys(hasError).some((key) => {
            return hasError[key];
        });

        if (isTeamInvalid) {
            setErrorFields({ ...hasError });
        } else {
            changeLoading(true);
            const res = team
                ? await editTeam(teamForm)
                : await createTeam(teamForm);

            if (res) {
                router.push(`/admin/tournamentDetail/${tournament._id}`);
            } else {
                alert('Error enviando el formulario, intente nuevamente');
            }
            changeLoading(false);
        }
    };

    const createTeam = async (team: Team): Promise<boolean> => {
        // only send players if the team is being created
        team.players = players.map(({ name, picture }) => ({
            name,
            picture,
        }));

        try {
            const res = await fetch(
                `${apiUrl}/tournaments/${tournament._id}/teams`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: AUTH_TOKEN,
                    },
                    body: JSON.stringify({ ...team }),
                }
            );

            const parsedRes = await res.json();

            return !parsedRes.message;
        } catch (e) {
            return false;
        }
    };

    const editTeam = async (editTeam: Team): Promise<boolean> => {
        const modedPlayers = getModedPlayers();
        const editPlayersOk = await editPlayers(modedPlayers);
        const uploadPlayersOk = await uploadPlayers();
        const isModed: boolean = isTeamModed(editTeam);

        if (editPlayersOk && isModed) {
            try {
                const editRes = await fetch(
                    `${apiUrl}/tournaments/${tournament._id}/teams/${team._id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: AUTH_TOKEN,
                        },
                        body: JSON.stringify({ ...editTeam }),
                    }
                );
                const parsedRes = await editRes.json();

                return !parsedRes.message;
            } catch (err) {
                return false;
            }
        } else if (!editPlayersOk) {
            return false;
        } else if (!isModed) {
            return true;
        }
    };

    const editPlayers = async (modedPlayers: Player[]): Promise<boolean> => {
        const playerResponses: PlayerRes[] = [];
        if (modedPlayers.length !== 0) {
            modedPlayers.forEach(async (p) => {
                try {
                    const res = await fetch(
                        `${apiUrl}/tournaments/${tournament._id}/teams/${team._id}/players/${p._id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: AUTH_TOKEN,
                            },
                            body: JSON.stringify({
                                name: p.name,
                                picture: p.picture,
                            }),
                        }
                    );
                    const parsedRes = await res.json();
                    playerResponses.push({
                        player: p,
                        isEdited: !parsedRes.message,
                    });
                } catch (err) {
                    return {
                        player: null,
                        isEdited: false,
                    };
                }
            });
        }

        return (
            playerResponses.every((r) => r.isEdited) ||
            playerResponses.length === 0
        );
    };

    const uploadPlayers = async (): Promise<boolean> => {
        const newPlayers: Player[] = players.filter((p) => !p._id);
        const playerResponses: PlayerRes[] = [];

        if (newPlayers.length !== 0) {
            newPlayers.map(async (p) => {
                const res = await fetch(
                    `${apiUrl}/tournaments/${tournament._id}/teams/${team._id}/players`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: AUTH_TOKEN,
                        },
                        body: JSON.stringify({
                            name: p.name,
                            picture: p.picture,
                        }),
                    }
                );
                const parsedRes = await res.json();
                playerResponses.push({
                    player: p,
                    isEdited: !parsedRes.message,
                });
            });
        }

        return (
            playerResponses.every((r) => r.isEdited) ||
            playerResponses.length === 0
        );
    };

    const isTeamModed = (editTeam: Team): boolean => {
        const isFieldModed: boolean[] = [];
        for (const key in editTeam) {
            isFieldModed.push(editTeam[key] !== team[key]);
        }
        return isFieldModed.some((field) => field);
    };

    const getModedPlayers = (): Player[] => {
        const teamFormPlayers: Player[] = [];
        players.forEach(({ _id, picture, name }) => {
            teamFormPlayers.push({ _id, picture, name });
        });
        const modedPlayers: Player[] = [];

        teamFormPlayers.forEach((p) => {
            const isPlayerModed = team.players?.find(
                (teamP) =>
                    p._id &&
                    (teamP.name !== p.name || teamP.picture !== p.picture)
            );
            if (isPlayerModed) {
                modedPlayers.push(p);
            }
        });

        return modedPlayers;
    };

    const discardPlayer = async (): Promise<void> => {
        const player = deletePlayer;
        changeLoading(true);
        try {
            const res = await fetch(
                `${apiUrl}/tournaments/${tournament._id}/teams/${team._id}/players/${player._id}`,
                {
                    headers: {
                        Authorization: AUTH_TOKEN,
                    },
                    method: 'DELETE',
                }
            );
            const parsedRes = await res.json();
            if (!parsedRes.message) {
                setPlayers(players.filter((p) => p._id !== player._id));
            }
        } catch (err) {
            alert('Error borrando al jugador, intente nuevamente');
        }
        changeLoading(false);
    };

    return tournament ? (
        <AdminLayout title="Admin - Crear Equipo">
            <div className="  min-h-screen bg-fondo-blanco">
                <ModalConfirm
                    show={deletePlayer !== null}
                    message="Si lo descarta este jugador quedará eliminado permanentemente."
                    onConfirm={() => {
                        setDeletePlayer(null);
                        discardPlayer();
                    }}
                    onCancel={() => {
                        setDeletePlayer(null);
                    }}
                />
                <div className="max-w-5xl m-auto">
                    <input
                        className="hidden"
                        type="file"
                        onChange={(e) => handleImgInput(e.target.files)}
                        accept="image/png, image/jpeg, image/jpg"
                        ref={imageInputRef}
                    />
                    <img
                        src="../images/overtimeLogo_bien.png"
                        alt="logo de overtime"
                        className="m-auto w-14 pt-6"
                    />
                    <div className="flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-center relative">
                        <Link href="/admin/torneos" className="absolute left-0">
                            <p className="text-sm text-naranja font-bold flex items-center font-din-display uppercase">
                                <img
                                    src="../logos - iconos/Flecha.png"
                                    alt=""
                                    className="w-4 rotate-180"
                                />
                                volver &nbsp;{' '}
                                <span className="hidden md:block">
                                    {' '}
                                    al torneo{' '}
                                </span>
                            </p>
                        </Link>
                        <div className="m-auto text-center ">
                            <span
                                className="cursor-pointer font-Helvetica text-md text-[#837fa0] font-bold uppercase"
                                onClick={() => router.push(`/admin/torneos`)}
                            >
                                {' '}
                                TORNEOS /{' '}
                            </span>{' '}
                            <span
                                className="cursor-pointer font-Helvetica text-md text-[#837fa0] font-bold uppercase"
                                onClick={() =>
                                    router.push(
                                        `/admin/tournamentDetail/${tournament._id}`
                                    )
                                }
                            >
                                {' '}
                                {tournament.name} /{' '}
                            </span>{' '}
                            <span className="cursor-pointer font-Helvetica text-md text-violeta font-bold uppercase">
                                {' '}
                                crear o editar equipo{' '}
                            </span>
                        </div>
                    </div>
                    <div className="max-w-5xl m-auto">
                        <h2 className="font-Fixture-ultra text-8xl uppercase text-center my-3 text-violeta">
                            {' '}
                            {team?.name || 'nuevo equipo'}{' '}
                        </h2>

                        <div className="w-max flex text-negro-texto m-auto gap-1 justify-center mt-12 font-Helvetica">
                            <div className="w-52 flex flex-col gap-1 items-center">
                                <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                    {' '}
                                    escudo{' '}
                                </span>
                                <div className="relative">
                                    <img
                                        src={`${IMAGE_URL}/${badge}`}
                                        alt="escudo"
                                        className="w-24"
                                    />

                                    <button
                                        className="absolute top-4 right-6 w-6"
                                        onClick={() => {
                                            openImgInput('badge');
                                        }}
                                    >
                                        <img
                                            src="../../logos - iconos/Editar 2.png"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="w-52 flex flex-col gap-1 items-center">
                                <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                    {' '}
                                    foto de equipo{' '}
                                </span>
                                <div className="relative">
                                    {teamPicture ? (
                                        <img
                                            src={`${IMAGE_URL}/${teamPicture}`}
                                            alt="equipo"
                                            className="w-36 h-20 mt-2"
                                        />
                                    ) : (
                                        <div className="w-36 h-20 mt-2 bg-violeta rounded-md "></div>
                                    )}
                                    <button
                                        className="absolute top-4 right-2 w-6"
                                        onClick={() =>
                                            openImgInput('teamPicture')
                                        }
                                    >
                                        <img
                                            src="../../logos - iconos/Editar 2.png"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="w-52 flex flex-col gap-1 items-center">
                                <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                    {' '}
                                    foto delegado{' '}
                                </span>
                                <div className="relative">
                                    <img
                                        src={`${IMAGE_URL}/${delegatePicture}`}
                                        alt="delegado"
                                        className="w-28"
                                    />
                                    <button
                                        className="absolute top-2 right-2 w-6"
                                        onClick={() =>
                                            openImgInput('delegatePicture')
                                        }
                                    >
                                        <img
                                            src="../../logos - iconos/Editar 1.png"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="m-auto max-w-5xl flex justify-center my-6">
                            <div className="w-full">
                                <div className="w-72 mx-auto flex justify-center">
                                    <div className="text-center">
                                        <span
                                            className={`text-negro-texto font-bold font-Helvetica uppercase ${
                                                errorFields['name'] &&
                                                errorStyle
                                            }`}
                                        >
                                            nombre
                                        </span>
                                        <div className="flex items-center justify-center gap-2">
                                            <TextField
                                                placeholder="nombre"
                                                isEditing={teamName.isEditing}
                                                handleEdit={(value) =>
                                                    setTeamName({
                                                        ...teamName,
                                                        isEditing: value,
                                                    })
                                                }
                                                value={teamName.value}
                                                onChange={(e) =>
                                                    setTeamName({
                                                        ...teamName,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="text-center text-negro-texto font-din-display uppercase my-3 bg-inherit "
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="justify-center m-auto flex mt-12">
                                    <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                        jugadores
                                    </span>
                                </div>
                                <div className="w-2/5 mx-auto bg-blanco mt-4 rounded-md">
                                    {players.map((player, idx) => (
                                        <div className="flex p-2 items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <img
                                                        src={`${IMAGE_URL}/${player.picture}`}
                                                        alt={
                                                            'jugador' +
                                                            (idx + 1)
                                                        }
                                                        className="w-12"
                                                    />
                                                    <div className="absolute top-0 w-full h-full bg-naranja opacity-8  opacity-[0.01] hover:opacity-60 flex justify-center items-center">
                                                        <button
                                                            onClick={() => {
                                                                openImgInput(
                                                                    'player',
                                                                    idx
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                src="../../logos - iconos/Editar 2.png"
                                                                alt=""
                                                                className="w-6"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                <TextField
                                                    isEditing={
                                                        players[idx].isEditing
                                                    }
                                                    handleEdit={() =>
                                                        handlePlayerEdit(
                                                            !players[idx]
                                                                .isEditing,
                                                            idx
                                                        )
                                                    }
                                                    value={players[idx].name}
                                                    onChange={(e) =>
                                                        handlePlayerChange(
                                                            e.target.value,
                                                            idx
                                                        )
                                                    }
                                                    placeholder={`Jugador ${
                                                        idx + 1
                                                    }`}
                                                    className="bg-inherit font-din-display font-bold ml-3 pl-2 text-negro-texto"
                                                />
                                            </div>
                                            <button className="px-4">
                                                <img
                                                    src="../../logos - iconos/Borrar - negro.png"
                                                    alt=""
                                                    className="w-6"
                                                    onClick={() => {
                                                        if (
                                                            !team ||
                                                            !player._id
                                                        ) {
                                                            setPlayers(
                                                                players.filter(
                                                                    (player) =>
                                                                        player !==
                                                                        players[
                                                                            idx
                                                                        ]
                                                                )
                                                            );
                                                        } else {
                                                            setDeletePlayer(
                                                                players[idx]
                                                            );
                                                        }
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                    <div
                                        className="flex cursor-pointer items-center justify-center rounded-md bg-naranja py-3 px-1"
                                        onClick={() =>
                                            setPlayers([
                                                ...players,
                                                getEmptyPlayer(
                                                    players.length + 1
                                                ),
                                            ])
                                        }
                                    >
                                        <button className="px-2 uppercase font-din-display  text-blanco">
                                            + crear
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="font-din-display font-bold px-1 text-blanco">
                                                    {' '}
                                                    Nuevo Jugador{' '}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center ">
                            <div className="my-6 mx-auto">
                                <div className="flex justify-center">
                                    <span className="text-negro-texto font-bold font-Helvetica uppercase">
                                        {' '}
                                        Torneo al que pertenece{' '}
                                    </span>
                                </div>
                                <div className="mt-6 grid grid-cols-3 max-w-5xl gap-2">
                                    {tournament.subtournaments.map(
                                        (subtournament, idx) => (
                                            <div
                                                className={`rounded-md flex justify-between px-4 py-3 items-center gap-6 ${
                                                    subtournaments.includes(
                                                        subtournament._id
                                                    )
                                                        ? 'bg-[#4e4585] bg-opacity-10'
                                                        : 'bg-blanco'
                                                }`}
                                            >
                                                <div className="w-4"></div>
                                                <span className="font-din-display uppercase text-negro-texto font-bold">
                                                    {subtournament.name}
                                                </span>
                                                <button
                                                    className={`w-4 h-4 rounded-md border ${
                                                        subtournaments.includes(
                                                            subtournament._id
                                                        )
                                                            ? 'bg-violeta border-violeta'
                                                            : 'border-negro-texto'
                                                    }`}
                                                    onClick={() =>
                                                        handleAddSubtournament(
                                                            subtournament._id
                                                        )
                                                    }
                                                ></button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-center mt-12">
                            <button
                                className="px-10 py-2 border-naranja border-2 text-naranja font-bold uppercase rounded-md font-din-display mb-24"
                                onClick={() =>
                                    router.push(
                                        `/admin/tournamentDetail/${tournament._id}`
                                    )
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-10 py-2 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display mb-24 text-blanco"
                                onClick={() => handleSubmit()}
                            >
                                {' '}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    ) : (
        <AdminLayout title="Admin - Crear Equipo">
            <div className="h-screen flex items-center justify-center font-Helvetica text-md text-[#837fa0] font-bold uppercase">
                <div>
                    <img
                        src="../images/overtimeLogo_bien.png"
                        alt="logo de overtime"
                        className="mx-auto w-36 pb-6"
                    />
                    Torneo no encontrado
                </div>
            </div>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    let team = {};
    const response = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}`
    );
    const tournament = await response.json();
    if (context.query.team) {
        const resTeam = await fetch(
            `${apiUrl}/tournaments/${context.query.tournament}/teams/${context.query.team}`
        );
        team = await resTeam.json();
    }

    return {
        props: {
            tournament: tournament._id ? tournament : '',
            ...team,
        },
    };
}
