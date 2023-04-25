import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL, AUTH_TOKEN } from '@constants';
import AdminLayout from '@components/Admin/AdminLayout';
import { useLoading } from '@context/LoadingContext';
import { ModalContinue } from '@components/index';

type Props = {
    isTokenInvalid: boolean;
};

const Login = ({ isTokenInvalid }: Props) => {
    const router = useRouter();

    const [error, setError] = useState<boolean>(false);
    const [errorToken, setErrorToken] = useState<boolean>(isTokenInvalid);
    console.log(errorToken);

    const [form, setForm] = useState({ nombre: '', password: '' });

    const handleForm = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const { changeLoading } = useLoading();

    useEffect(() => {
        if (localStorage.getItem('token') && !router.query.tokenInvalid) {
            router.replace('/admin/home');
        }
    }, []);

    async function login(e) {
        e.preventDefault();
        changeLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.nombre,
                    password: form.password,
                }),
            }).then((response) => response.json());

            if (response.token) {
                localStorage.setItem('token', response.token);
                location.reload();
            } else {
                setError(true);
            }
        } catch (err) {
            alert('Error iniciando sesion, intente nuevamente');
        }
        changeLoading(false);
    }

    const removeQueryParam = (param: string) => {
        const { pathname, query }: any = router;
        const params = new URLSearchParams(query);
        params.delete(param);
        router.replace({ pathname, query: params.toString() }, undefined, {
            shallow: true,
        });
    };

    return (
        <AdminLayout title="Admin - Login">
            <ModalContinue
                show={errorToken}
                message="Su sesion ha caducado, por favor ingrese nuevamente"
                onContinue={() => {
                    setErrorToken(false);
                    removeQueryParam('tokenInvalid');
                }}
            />
            <div className="bg-fondo-blanco min-h-screen">
                <div className="max-w-5xl grid place-items-center h-screen m-auto  font-din-display">
                    <form method="post" onSubmit={login}>
                        <img
                            className="w-32 m-auto mb-12"
                            src="/images/overtimeLogo_bien.png"
                        />
                        <p className="uppercase text-fondo text-lg font-bold text-center m-6 font-Helvetica">
                            {' '}
                            ¡Bienvenido!{' '}
                        </p>
                        <div className="flex flex-col m-auto  my-2 w-96">
                            <label
                                htmlFor="nombre"
                                className="text-sm py-1 ml-0.5 "
                            >
                                {' '}
                                Nombre{' '}
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                className={
                                    'border-2 bg-fondo-blanco p-2 border-gris rounded-md focus:outline-none focus:border-violeta ring-violeta focus:ring-1' +
                                    (error ? ' border-naranja' : ' ')
                                }
                                onChange={(e) =>
                                    handleForm('nombre', e.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col my-2 w-96 m-auto">
                            <label
                                htmlFor="password"
                                className="text-sm py-1 ml-0.5 "
                            >
                                {' '}
                                Contraseña{' '}
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={
                                    'border-2 bg-fondo-blanco p-2 border-gris rounded-md focus:outline-none focus:border-violeta ring-violeta focus:ring-1' +
                                    (error ? ' border-naranja' : ' ')
                                }
                                onChange={(e) =>
                                    handleForm('password', e.target.value)
                                }
                            />
                        </div>
                        {error && (
                            <p className=" text-naranja font-bold ">
                                las credenciales no coinciden con un usuario
                                registrado.
                            </p>
                        )}
                        <div className="flex justify-center mt-8">
                            <button
                                onSubmit={login}
                                className="uppercase m-auto px-12 py-3 bg-naranja text-blanco rounded-md text-sm font-bold hover:bg-blanco hover:text-naranja border hover:border-naranja transition-all box-border "
                            >
                                {' '}
                                Ingresar{' '}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Login;

export async function getServerSideProps(context) {
    return {
        props: {
            isTokenInvalid: context.query?.tokenInvalid || null,
        },
    };
}
