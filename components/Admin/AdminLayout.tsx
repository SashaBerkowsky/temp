import { useEffect, useState } from 'react';
import Head from 'next/head';
import { API_URL } from '@constants';
import { useLoading } from '@context/LoadingContext';
import { useRouter } from 'next/router';

const AdminLayout = ({ children, title = 'Admin' }) => {
    const router = useRouter();
    const { changeLoading } = useLoading();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const handleStart = () => changeLoading(true);
        const handleComplete = () => changeLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        const testToken = async (): Promise<void> => {
            changeLoading(true);
            const tokenRes = await fetch(`${API_URL}/login/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const parsedRes = await tokenRes.json();

            changeLoading(false);

            if (parsedRes.error) {
                localStorage.removeItem('token');
                router.push('/admin?tokenInvalid=true');
            }
        };

        if (router.pathname !== '/admin') {
            testToken();
        }

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/overtimeLogoNoMargin.png" />
            </Head>
            <div>
                {router.pathname !== '/admin' && (
                    <button
                        className="flex absolute top-12 right-48 text-naranja hover:underline gap-1"
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/admin');
                        }}
                    >
                        <div className="font-din-display font-bold uppercase ">
                            Cerrar Sesión
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </button>
                )}
                {children}
            </div>
        </>
    );
};

export default AdminLayout;
