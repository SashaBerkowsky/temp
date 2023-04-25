import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ModalDialog from 'react-basic-modal-dialog';
import apiUrl from '../../../constants/apiUrl';
import Link from 'next/link';
import { useLoading } from '@context/LoadingContext';
import { AUTH_TOKEN, IMAGE_URL } from '@constants';
import { getTime, getDate } from '@utils/dateFormat';
import AdminLayout from '@components/Admin/AdminLayout';

const TournamentDetail = ({ tournament }) => {
    const router = useRouter();

    const { changeLoading } = useLoading();

    const [selectedSubTournamentName, setSelectedSubTournamentName] =
        useState(null);
    const [selectedSubtournamentData, setSelectedSubtournamentData] =
        useState(null);

    const [isDeleteTeamDialogVisible, setIsDeleteTeamDialogVisible] =
        useState(false);
    const openDeleteTeamDialog = () => setIsDeleteTeamDialogVisible(true);
    const closeDeleteTeamDialog = () => setIsDeleteTeamDialogVisible(false);

    const [selectedTeamId, setSelectedTeamId] = useState('');

    const [
        isDeleteSubtournamentDialogVisible,
        setIsDeleteSubtournamentDialogVisible,
    ] = useState(false);
    const openDeleteSubtournamentDialog = () =>
        setIsDeleteSubtournamentDialogVisible(true);
    const closeDeleteSubtournamentDialog = () =>
        setIsDeleteSubtournamentDialogVisible(false);

    const [selectedsubtournamentId, setSelectedsubtournamentId] = useState('');

    function equipoEnSubtorneo(equipo) {
        return selectedSubtournamentData?.teams.find(
            (team) => team._id == equipo
        );
    }

    useEffect(() => {
        if (selectedSubTournamentName) {
            changeLoading(true);
            fetch(
                `${apiUrl}/tournaments/${router.query.id}/subtournaments/${
                    tournament.subtournaments.find(
                        (i) => i.name === selectedSubTournamentName
                    )._id
                }`
            )
                .then((response) => response.json())
                .then((data) => {
                    changeLoading(false);
                    setSelectedSubtournamentData(data.subtournament);
                });
        }
    }, [selectedSubTournamentName]);

    async function deleteTeam() {
        changeLoading(true);
        closeDeleteTeamDialog();
        const response = await fetch(
            `${apiUrl}/tournaments/${router.query.id}/teams/${selectedTeamId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: AUTH_TOKEN,
                },
            }
        )
            .then((response) => response.json())

            .catch((error) => console.log(error));

        if (response) {
            location.reload();
        }
        changeLoading(false);
    }

    async function deleteSubtournament() {
        changeLoading(true);
        closeDeleteSubtournamentDialog();
        const response = await fetch(
            `${apiUrl}/tournaments/${router.query.id}/subtournaments/${selectedsubtournamentId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: AUTH_TOKEN,
                },
            }
        )
            .then((response) => response.json())
            .catch((error) => console.log(error));

        if (response) {
            location.reload();
        }
        changeLoading(false);
    }

    function getRoundsFromMatches(matches: any) {
        const roundsSet = new Set<string>();
        matches.forEach((match: any) => {
            roundsSet.add(match.round);
        });
        const roundsArray = Array.from(roundsSet);
        return roundsArray;
    }

    const [selectedMatches, setSelectedMatches] = useState('');

    function matchesByRound(round: any) {
        if (!round) return selectedSubtournamentData.matches;

        return selectedSubtournamentData.matches.filter(
            (match) => match.round == round
        );
    }

    return (
        <AdminLayout title="Admin - Torneo">
            <div className="min-h-screen bg-fondo-blanco min-w-screen">
                <div className="max-w-5xl m-auto ">
                    <img
                        src="../../images/overtimeLogo_bien.png"
                        alt="logo de overtime"
                        className="m-auto w-14 pt-6"
                    />
                    <div className="flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-between">
                        <Link href="/admin/torneos">
                            <p className="text-naranja font-bold text-sm flex items-center font-din-display uppercase">
                                <img
                                    src="../../logos - iconos/Flecha.png"
                                    alt=""
                                    className="w-4 rotate-180"
                                />
                                volver &nbsp;{' '}
                                <span className="hidden md:block">
                                    {' '}
                                    al inicio{' '}
                                </span>
                            </p>
                        </Link>
                        <div className="m-auto text-center ">
                            <span className="font-Helvetica text-md text-[#837fa0] font-bold">
                                TORNEOS /{' '}
                            </span>{' '}
                            <span className="font-Helvetica text-md text-violeta font-bold uppercase">
                                {' '}
                                {tournament.name}{' '}
                            </span>
                        </div>
                        <div className="w-32"></div>
                    </div>
                    <h2 className=" font-Fixture-ultra text-8xl uppercase text-center my-3 text-violeta">
                        {tournament.name}
                    </h2>
                    <div className="grid grid-cols-3 gap-3 max-w-3xl m-auto mt-12">
                        {tournament?.subtournaments?.length > 0 &&
                            tournament?.subtournaments.map((i, index) => (
                                <div
                                    key={index}
                                    className={
                                        ' px-2 py-2 rounded-md flex items-center justify-end  text-negro-texto ' +
                                        (selectedSubTournamentName === i.name
                                            ? ' bg-naranja text-blanco'
                                            : ' bg-blanco')
                                    }
                                >
                                    <button
                                        className="flex items-center justify-center font-din-display uppercase font-bold text-center flex-1"
                                        onClick={() =>
                                            setSelectedSubTournamentName(i.name)
                                        }
                                    >
                                        {i.name}
                                    </button>
                                    <Link
                                        href={`/admin/tournamentDetail/subtorneo?tournament=${tournament._id}&subtournament=${i._id}`}
                                    >
                                        <img
                                            src="../../logos - iconos/Editar 1.png"
                                            className="w-6"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedsubtournamentId(i._id);
                                            openDeleteSubtournamentDialog();
                                        }}
                                    >
                                        <img
                                            src="../../logos - iconos/Borrar - negro.png"
                                            className="w-5"
                                        />
                                    </button>
                                    <ModalDialog
                                        isDialogVisible={
                                            isDeleteSubtournamentDialogVisible
                                        }
                                        closeDialog={
                                            closeDeleteSubtournamentDialog
                                        }
                                        dialogClassName={
                                            'rounded-md lg:max-w-3xl border border-black'
                                        }
                                        divClassName="relative"
                                    >
                                        <div className="font-din-display py-2 px-10">
                                            <p className="uppercase font-Helvetica text-xl">
                                                Borrar subtorneo?{' '}
                                            </p>
                                            <hr className=" uppercase mb-12" />
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    className=" uppercase py-2 px-5 rounded-md bg-naranja   text-blanco text-lg"
                                                    onClick={() =>
                                                        deleteSubtournament()
                                                    }
                                                >
                                                    {' '}
                                                    borrar{' '}
                                                </button>
                                                <button
                                                    className=" uppercase py-2 px-5 rounded-md "
                                                    onClick={
                                                        closeDeleteSubtournamentDialog
                                                    }
                                                >
                                                    {' '}
                                                    cancelar{' '}
                                                </button>
                                            </div>
                                        </div>
                                    </ModalDialog>
                                </div>
                            ))}
                    </div>
                    <div className="mt-12 flex justify-end gap-12 text-naranja  font-din-display max-w-3xl m-auto">
                        <Link
                            href={`/admin/crearEquipo?tournament=${tournament._id}`}
                            className="uppercase font-bold"
                        >
                            + Crear equipo
                        </Link>
                        <Link
                            href={`/admin/tournamentDetail/subtorneo?tournament=${tournament._id}`}
                            className="uppercase font-bold"
                        >
                            + Crear subtorneo
                        </Link>
                    </div>
                </div>
                <div className="gradient-blanco-vertical pb-6">
                    <div className="m-auto max-w-5xl mt-12 ">
                        <h4 className="text-center pt-12 uppercase text-negro-texto font-bold text-lg font-Helvetica">
                            {selectedSubTournamentName}
                        </h4>
                        <h6 className="text-center pt-12 uppercase text-negro-texto font-bold text-lg font-Helvetica opacity-80">
                            EQUIPOS
                        </h6>
                        <div className="grid grid-cols-3 gap-3 mt-12">
                            {tournament?.teams?.length > 0 ? (
                                tournament?.teams.map((i, index) => (
                                    <div
                                        className={
                                            ' flex justify-between py-2 px-3 rounded-md' +
                                            (equipoEnSubtorneo(i._id)
                                                ? ' bg-naranja text-blanco '
                                                : ' bg-blanco')
                                        }
                                        key={index}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`${IMAGE_URL}/${i.badge}`}
                                                className="w-10 h-10 object-contain"
                                            ></img>
                                            <h6 className="font-din-display">
                                                {i.name}
                                            </h6>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/crearEquipo?tournament=${tournament._id}&team=${i._id}`}
                                            >
                                                <img
                                                    src="../../logos - iconos/Editar 1.png"
                                                    className="w-5"
                                                />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedTeamId(i._id);
                                                    openDeleteTeamDialog();
                                                }}
                                            >
                                                <img
                                                    src="../../logos - iconos/Borrar - negro.png"
                                                    className="w-5"
                                                />
                                            </button>
                                            <ModalDialog
                                                isDialogVisible={
                                                    isDeleteTeamDialogVisible
                                                }
                                                closeDialog={
                                                    closeDeleteTeamDialog
                                                }
                                                dialogClassName={
                                                    'rounded-md lg:max-w-3xl border border-black'
                                                }
                                                divClassName="relative"
                                            >
                                                <div className="font-din-display py-2 px-10">
                                                    <p className="uppercase font-Helvetica text-xl">
                                                        Borrar equipo?{' '}
                                                    </p>
                                                    <hr className=" uppercase mb-12" />
                                                    <p className="font-Helvetica">
                                                        Atención: si el equipo
                                                        tiene partidos creados
                                                        está acción puede causar
                                                        errores.
                                                    </p>

                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            className=" uppercase py-2 px-5 rounded-md bg-naranja   text-blanco text-lg"
                                                            onClick={() =>
                                                                deleteTeam()
                                                            }
                                                        >
                                                            {' '}
                                                            borrar{' '}
                                                        </button>
                                                        <button
                                                            className=" uppercase py-2 px-5 rounded-md "
                                                            onClick={
                                                                closeDeleteTeamDialog
                                                            }
                                                        >
                                                            {' '}
                                                            cancelar{' '}
                                                        </button>
                                                    </div>
                                                </div>
                                            </ModalDialog>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No hay equipos en el torneo</p>
                            )}
                        </div>
                    </div>
                </div>
                {selectedSubtournamentData && (
                    <div className="m-auto max-w-5xl">
                        <div className="flex justify-center gap-2 my-12">
                            <span className="font-Helvetica text-md text-violeta font-bold uppercase">
                                {' '}
                                fixture /{' '}
                            </span>{' '}
                            <span className="font-Helvetica text-md text-[#837fa0] font-bold">
                                {' '}
                                ULTIMOS PARTIDOS CARGADOS{' '}
                            </span>
                        </div>

                        <div className="flex gap-5 items-center justify-center">
                            <span className=" text-negro-texto font-din-display font-bold">
                                {' '}
                                Filtrar{' '}
                            </span>
                            <select
                                name=""
                                className="bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-44 focus:border-naranja block py-2.5 px-8"
                                id="fecha"
                                defaultValue="fecha"
                                onChange={(e) =>
                                    setSelectedMatches(e.target.value)
                                }
                            >
                                <option
                                    className="font-bold p-2"
                                    selected
                                    value={''}
                                >
                                    todos
                                </option>
                                {selectedSubtournamentData?.matches &&
                                    getRoundsFromMatches(
                                        selectedSubtournamentData?.matches
                                    ).map((round, index) => {
                                        return (
                                            <option
                                                className="font-bold p-2"
                                                key={index}
                                            >
                                                {round}
                                            </option>
                                        );
                                    })}
                            </select>

                            <Link
                                className="text-naranja uppercase font-bold font-din-display"
                                href={`/admin/crearPartido?tournament=${tournament._id}&subtournament=${selectedSubtournamentData._id}`}
                            >
                                {' '}
                                + crear partido{' '}
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 mt-12 mx-auto pb-12 gap-2 max-w-fit place-content-center">
                            {selectedSubtournamentData?.matches?.length > 0 &&
                            selectedSubtournamentData?.teams ? (
                                matchesByRound(selectedMatches).map(
                                    (i, index) => (
                                        <div key={index} className="">
                                            <MatchPreview
                                                matchData={i}
                                                teams={
                                                    selectedSubtournamentData?.teams
                                                }
                                                subtournamentId={
                                                    selectedSubtournamentData?._id
                                                }
                                            />
                                        </div>
                                    )
                                )
                            ) : (
                                <p>No hay partidos</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default TournamentDetail;

export async function getServerSideProps(context) {
    const response = await fetch(`${apiUrl}/tournaments/${context.query.id}`);
    const tournament = await response.json();

    return {
        props: {
            tournament: tournament,
        },
    };
}

const MatchPreview = ({ matchData, teams, subtournamentId }) => {
    const router = useRouter();
    const { changeLoading } = useLoading();
    const fecha = new Date(matchData.date);

    const fechaTexto = getDate(fecha);
    const horaTexto = getTime(fecha);

    const getTeamsNameById = (id) => {
        return teams?.find((i) => i._id === id)?.name;
    };
    const getTeamsBadgeById = (id) => {
        return teams?.find((i) => i._id === id)?.badge;
    };

    const [isDeleteMatchDialogVisible, setIsDeleteMatchDialogVisible] =
        useState(false);
    const openDeleteMatchDialog = () => setIsDeleteMatchDialogVisible(true);
    const closeDeleteMatchDialog = () => setIsDeleteMatchDialogVisible(false);

    async function deleteMatch() {
        changeLoading(true);
        closeDeleteMatchDialog();
        const response = await fetch(
            `${apiUrl}/tournaments/${router.query.id}/subtournaments/${subtournamentId}/matches/${matchData._id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: AUTH_TOKEN,
                },
            }
        )
            .then((response) => response.json())
            .catch((error) => console.log(error));
        changeLoading(false);

        if (response._id) {
            location.reload();
        }
    }

    return (
        <>
            {matchData && (
                <div
                    className={`${
                        matchData.team1Score !== undefined &&
                        matchData.team2Score !== undefined
                            ? 'bg-newvioleta-claro bg-opacity-10'
                            : 'bg-blanco'
                    } rounded-md text-negro-texto font-din-display max-w-lg py-2 px-4 h-full`}
                >
                    <div className="flex justify-between">
                        <div className="flex items-center m-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src={`${IMAGE_URL}/${getTeamsBadgeById(
                                        matchData.team1
                                    )}`}
                                    className="w-10 h-10 object-contain"
                                ></img>
                                <p className="uppercase opacity-80">
                                    {getTeamsNameById(matchData.team1)}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-3">
                            <div
                                className={`rounded-sm w-10 text-center py-1 ${
                                    matchData.team1Score !== undefined &&
                                    matchData.team2Score !== undefined &&
                                    'bg-newvioleta-claro bg-opacity-20'
                                }`}
                            >
                                <span>
                                    {matchData.team1Score !== undefined
                                        ? matchData.team1Score
                                        : '-'}{' '}
                                </span>
                            </div>
                            <div
                                className={`rounded-sm w-10 text-center py-1 ${
                                    matchData.team1Score !== undefined &&
                                    matchData.team2Score !== undefined &&
                                    'bg-newvioleta-claro bg-opacity-20'
                                }`}
                            >
                                <span>
                                    {matchData.team2Score !== undefined
                                        ? matchData.team2Score
                                        : '-'}{' '}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center m-2">
                            <div className="flex items-center gap-2">
                                <p className="uppercase opacity-80">
                                    {getTeamsNameById(matchData.team2)}
                                </p>

                                <img
                                    src={`${IMAGE_URL}/${getTeamsBadgeById(
                                        matchData.team2
                                    )}`}
                                    className="w-10 h-10 object-contain"
                                ></img>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-between">
                        <div className="p-1">
                            <p className="opacity-80 font-semibold uppercase">
                                {' '}
                                {matchData.matchType}
                            </p>
                            <div className="flex gap-5 ">
                                <div className="font-bold">
                                    {horaTexto || '-'}
                                </div>
                                <div className="opacity-60 font-bold">
                                    {fechaTexto || '-'}
                                </div>
                                <div className="opacity-60 font-bold">
                                    {matchData.location || '-'}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 p-2 items-center">
                            <Link
                                href={`/admin/crearPartido?tournament=${router.query.id}&subtournament=${subtournamentId}&match=${matchData._id}`}
                                className="block"
                            >
                                <img
                                    src="../../logos - iconos/Editar 1.png"
                                    className="w-5"
                                />
                            </Link>
                            <button onClick={() => openDeleteMatchDialog()}>
                                <img
                                    src="../../logos - iconos/Borrar - negro.png"
                                    className="w-5"
                                />
                            </button>
                            <ModalDialog
                                isDialogVisible={isDeleteMatchDialogVisible}
                                closeDialog={closeDeleteMatchDialog}
                                dialogClassName={
                                    'rounded-md lg:max-w-3xl border-black border'
                                }
                                divClassName="relative  "
                            >
                                <div className="font-din-display py-2 px-10">
                                    <p className="uppercase font-Helvetica text-xl">
                                        Borrar partido?{' '}
                                    </p>
                                    <hr className=" uppercase mb-12" />
                                    <div className="flex justify-center gap-3">
                                        <button
                                            className=" uppercase py-2 px-5 rounded-md bg-naranja   text-blanco text-lg"
                                            onClick={deleteMatch}
                                        >
                                            {' '}
                                            borrar{' '}
                                        </button>
                                        <button
                                            className=" uppercase py-2 px-5 rounded-md "
                                            onClick={closeDeleteMatchDialog}
                                        >
                                            {' '}
                                            cancelar{' '}
                                        </button>
                                    </div>
                                </div>
                            </ModalDialog>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
