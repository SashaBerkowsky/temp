import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AUTH_TOKEN } from '@constants';
import apiUrl from '../../constants/apiUrl';
import Link from 'next/link';
import ModalDialog from 'react-basic-modal-dialog';
import AdminLayout from '@components/Admin/AdminLayout';
import { useLoading } from '@context/LoadingContext';

const TournamentsAdmin = ({ tournaments }) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const openDialog = () => setIsDialogVisible(true);
    const closeDialog = () => setIsDialogVisible(false);

    const [
        isDeleteTournamentDialogVisible,
        setIsDeleteTournamentDialogVisible,
    ] = useState(false);
    const openDeleteTournamentDialog = () =>
        setIsDeleteTournamentDialogVisible(true);
    const closeDeleteTournamentDialog = () =>
        setIsDeleteTournamentDialogVisible(false);

    const [nombreTorneo, setNombreTorneo] = useState('');
    const { isLoading, changeLoading } = useLoading();

    async function agregarTorneo(e) {
        e.preventDefault();
        changeLoading(true);
        closeDialog();

        try {
            const torneo = await fetch(`${apiUrl}/tournaments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AUTH_TOKEN,
                },
                body: JSON.stringify({ name: nombreTorneo }),
            })
                .then((response) => response.json())
                .catch((error) => console.log('error: ' + error));

            tournaments.push({
                name: torneo.name,
                _id: torneo._id,
            });
        } catch (err) {
            alert('Error creando torneo, intente nuevamente');
        }
        setNombreTorneo('');
        changeLoading(false);

        closeDialog();
    }

    const [tournamentId, setTournamentId] = useState('');

    async function deleteTournament() {
        closeDeleteTournamentDialog();
        changeLoading(true);
        const response = await fetch(`${apiUrl}/tournaments/${tournamentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: AUTH_TOKEN,
            },
        })
            .then((response) => response.json())
            .catch((error) => console.log(error));

        changeLoading(false);

        if (response) {
            location.reload();
        }
    }

    return (
        <AdminLayout title="Admin - Torneos">
            <div className="  min-h-screen bg-fondo-blanco">
                <div className="max-w-5xl m-auto">
                    <img
                        src="../images/overtimeLogo_bien.png"
                        alt="logo de overtime"
                        className="m-auto w-16 pt-10"
                    />
                    <div className="flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-center relative">
                        <Link href="/admin/home" className="absolute left-0">
                            <p className="text-naranja font-bold flex items-center font-din-display uppercase">
                                <img
                                    src="../logos - iconos/Flecha.png"
                                    alt=""
                                    className="w-6 rotate-180"
                                />
                                volver &nbsp;{' '}
                                <span className="hidden md:block">
                                    {' '}
                                    al inicio{' '}
                                </span>
                            </p>
                        </Link>
                        <div className="m-auto text-center ">
                            <span className="font-Helvetica text-lg text-[#837fa0] font-bold">
                                TORNEO DE BÁSQUET /{' '}
                            </span>{' '}
                            <span className="font-Helvetica text-lg text-violeta font-bold uppercase">
                                {' '}
                                Torneos{' '}
                            </span>
                        </div>
                    </div>
                    <div className="text-9xl text-center m-auto my-12 uppercase font-Fixture-ultra text-violeta">
                        {' '}
                        torneos{' '}
                    </div>
                    <div className="grid grid-cols-3 gap-4 max-w-[90vw] md:max-w-2xl m-auto">
                        {tournaments &&
                            tournaments.map((i, index) => (
                                <div
                                    className="font-din-display font-bold rounded-md uppercase text-sm text-negro-texto text-center bg-blanco py-3 overflow-hidden truncate px-1 flex justify-between"
                                    key={index}
                                >
                                    <Link
                                        href={`tournamentDetail/${i._id}`}
                                        key={index}
                                        className="text-center flex-1"
                                    >
                                        {i.name}
                                    </Link>
                                    <button
                                        className="pr-2"
                                        onClick={() => {
                                            setTournamentId(i._id);
                                            openDeleteTournamentDialog();
                                        }}
                                    >
                                        <img
                                            src="../../logos - iconos/Borrar - negro.png"
                                            className="w-5"
                                        />
                                    </button>
                                    <ModalDialog
                                        isDialogVisible={
                                            isDeleteTournamentDialogVisible
                                        }
                                        closeDialog={
                                            closeDeleteTournamentDialog
                                        }
                                        dialogClassName={
                                            'rounded-md lg:max-w-3xl border border-black z-20'
                                        }
                                        divClassName="relative"
                                    >
                                        <div className="font-din-display py-2 px-10">
                                            <p className="uppercase font-Helvetica text-xl">
                                                Borrar Torneo?{' '}
                                            </p>
                                            <hr className=" uppercase mb-12" />
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    className=" uppercase py-2 px-5 rounded-md bg-naranja   text-blanco text-lg"
                                                    onClick={() =>
                                                        deleteTournament()
                                                    }
                                                >
                                                    {' '}
                                                    borrar{' '}
                                                </button>
                                                <button
                                                    className=" uppercase py-2 px-5 rounded-md "
                                                    onClick={
                                                        closeDeleteTournamentDialog
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
                    <div className="flex justify-center py-12">
                        <button
                            className="px-8 py-3 bg-naranja rounded-md m-auto"
                            onClick={openDialog}
                        >
                            <img
                                src="../logos - iconos/Nuevo Torneo.png"
                                alt="agregar torneo"
                                className="w-8"
                            />
                        </button>
                    </div>

                    <ModalDialog
                        isDialogVisible={isDialogVisible}
                        closeDialog={closeDialog}
                        dialogClassName={'rounded-md lg:max-w-3xl'}
                        divClassName="relative"
                    >
                        <div className="">
                            <div className="flex justify-between">
                                <span className="font-bold text-negro-texto">
                                    Nuevo Torneo
                                </span>
                                <button
                                    className=" text-naranja"
                                    onClick={closeDialog}
                                    type="button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className={'w-6 h-6'}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <form method="post" onSubmit={agregarTorneo}>
                                <div className="flex flex-col gap-2 mt-6">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        className="bg-fondo-blanco rounded-md p-2"
                                        value={nombreTorneo || ''}
                                        onChange={(e) =>
                                            setNombreTorneo(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        className="bg-naranja px-5 py-2 text-blanco rounded-md mt-12 "
                                        onSubmit={agregarTorneo}
                                        disabled={isLoading}
                                    >
                                        + Agregar Torneo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ModalDialog>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TournamentsAdmin;

export async function getServerSideProps(context) {
    const response = await fetch(`${apiUrl}/tournaments`);
    const tournaments = await response.json();
    return {
        props: {
            tournaments: tournaments,
        },
    };
}
