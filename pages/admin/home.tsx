import Link from 'next/link';
import AdminLayout from '@components/Admin/AdminLayout';

const Home = () => {
    return (
        <AdminLayout title="Admin - Home">
            <div className="px-5 bg-fondo-blanco min-h-screen">
                <img
                    src="../images/overtimeLogo_bien.png"
                    alt="logo de overtime"
                    className="m-auto w-16 pt-10"
                />

                <div className="m-auto text-center pt-5 md:pt-20">
                    <span className="font-Helvetica text-lg text-[#837fa0] font-bold">
                        TORNEO DE BÁSQUET /{' '}
                    </span>{' '}
                    <span className="font-Helvetica text-lg text-violeta font-bold">
                        {' '}
                        PANEL ADMINISTRATIVO{' '}
                    </span>
                </div>

                <img
                    src="/OVERTIME-violeta.png"
                    className="w-[90%] lg:w-[60%] xl:w-[600px] mx-auto pt-12"
                />

                <div className="m-auto flex gap-3 justify-center my-12 font-bold">
                    <Link
                        href="/admin/fotos/galeria"
                        className="text-center uppercase w-52 bg-naranja border-naranja border text-blanco font-din-display px-12 py-2 rounded-md hover:bg-blanco hover:text-naranja"
                    >
                        {' '}
                        fotos{' '}
                    </Link>
                    <Link
                        href="/admin/torneos"
                        className="text-center uppercase w-52 bg-naranja border-naranja border text-blanco font-din-display px-12 py-2 rounded-md hover:bg-blanco hover:text-naranja"
                    >
                        {' '}
                        torneos{' '}
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Home;
