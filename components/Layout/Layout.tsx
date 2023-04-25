import { PropsWithChildren, useState, useEffect } from 'react';
import Head from 'next/head';
import config from '../../config/default.json';
import apiUrl from '../../constants/apiUrl';
import { useLoading } from '@context/LoadingContext';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const appName = config.appName;

type LayoutProps = PropsWithChildren<{
    title?: string;
    id: string;
}>;

const Layout = ({ children, title = 'Página sin título', id }: LayoutProps) => {
    const mainClass = classNames({ [id]: id });
    const pageTitle = `${appName} - ${title}`;

    const router = useRouter();

    const [menu, setMenu] = useState([]);
    const [ShowTournaments, setShowTournaments] = useState<boolean>(false);

    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };
    const [menuToggle, setMenuToggle] = useState<boolean>(false);
    const toggleMenu = () => setMenuToggle(!menuToggle);
    const { changeLoading } = useLoading();

    useEffect(() => {
        changeLoading(true);
        fetch(`${apiUrl}/tournaments/categories`)
            .then((response) => response.json())
            .then((data) => {
                setMenu(data);
                changeLoading(false);
            });

        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleStart = () => changeLoading(true);
        const handleComplete = () => {
            changeLoading(false);
            setMenuToggle(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <link rel="icon" href="/images/overtimeLogoNoMargin.png" />
            </Head>

            <header
                className={
                    ' sticky top-0 hidden lg:block h-[6vh] min-h-[40px] z-40' +
                    (scrollPosition > 0 ||
                    (router.pathname != '/' &&
                        router.pathname != '/proximamente')
                        ? ' bg-menu '
                        : ' bg-fondo')
                }
            >
                <nav className="flex max-w-5xl justify-center m-auto items-center h-full ">
                    <Link href="/">
                        <img
                            src="/images/overtimeLogo_bien.png"
                            alt="logo de overtime basquet"
                            className="w-9 mx-2"
                        />
                    </Link>
                    <ul className="flex-1 uppercase flex items-center text-blanco  justify-evenly max-w-4xl m-auto text-[0.75rem]">
                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/"
                            >
                                Inicio
                            </Link>
                        </li>
                        <li
                            className="relative cursor-pointer hover:text-naranja transition-all duration-150 flex items-center gap-2"
                            onMouseEnter={() => setShowTournaments(true)}
                            onMouseLeave={() => setShowTournaments(false)}
                        >
                            <div className="opacity-80 py-2">Torneos 2022</div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={
                                    'w-4 h-4 transition-transform duration-300 ' +
                                    (ShowTournaments
                                        ? ' rotate-180'
                                        : ' rotate-0 ')
                                }
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                            <div
                                className={
                                    'absolute top-9  tournamentList z-30 -left-1.5 w-64  overflow-auto max-h-[90vh] ' +
                                    (ShowTournaments ? ' block' : ' hidden')
                                }
                                onMouseEnter={() => setShowTournaments(true)}
                            >
                                {menu.map((data, index) => {
                                    return (
                                        <MenuItemDesktop
                                            key={index}
                                            titulo={data.label}
                                            link={
                                                data.chldren ? null : data.label
                                            }
                                            level="4"
                                            desktop={true}
                                        >
                                            {data.children?.map(
                                                (child, indexChildren) => {
                                                    return (
                                                        <MenuItemDesktop
                                                            level="4"
                                                            key={indexChildren}
                                                            titulo={child.label}
                                                            bold={false}
                                                            link={{
                                                                pathname:
                                                                    '/subtournament/[id]',
                                                                query: {
                                                                    id: child.key,
                                                                    tournament:
                                                                        data.key,
                                                                },
                                                            }}
                                                        />
                                                    );
                                                }
                                            )}
                                        </MenuItemDesktop>
                                    );
                                })}
                            </div>
                        </li>

                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/proximamente"
                            >
                                Galería
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/proximamente"
                            >
                                Inscribite
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/proximamente"
                            >
                                Contacto
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/proximamente"
                            >
                                Palmarés
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="opacity-80 hover:text-naranja transition-all duration-150"
                                href="/proximamente"
                            >
                                Torneos archivados
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center justify-evenly gap-3">
                                <a href="tiktok.com" target="_blank">
                                    <img
                                        src="/logos - iconos/Tik Tok.png"
                                        alt="tiktok"
                                        className="w-6"
                                    />
                                </a>
                                <a
                                    href="https://www.youtube.com/@mediaovertime"
                                    target="_blank"
                                >
                                    <img
                                        src="/logos - iconos/Youtube.png"
                                        alt="youtube"
                                        className="w-6"
                                    />
                                </a>
                                <a
                                    href="https://www.instagram.com/overtime.basquet/?hl=es"
                                    target="_blank"
                                >
                                    <img
                                        src="/logos - iconos/Instagram.png"
                                        alt="Instagram"
                                        className="w-6"
                                    />
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>

            <header className="lg:hidden h-[9vh] relative bg-fondo z-40">
                <button
                    className="top-1/2 -translate-y-1/2 left-5 absolute"
                    onClick={toggleMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={'w-6 h-6 text-blanco '}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>

                <img
                    src="/images/overtimeLogo_bien.png"
                    alt="logo de overtime basquet"
                    className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute w-9"
                />

                <nav
                    className={
                        'fixed inset-0 w-screen transition-all duration-300 z-10 bg-menu h-[100vh] overflow-auto' +
                        (menuToggle
                            ? ' translate-y-0 '
                            : '  -translate-y-full ')
                    }
                >
                    <button className="mt-5 ml-5 absolute" onClick={toggleMenu}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={'w-6 h-6 text-blanco'}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <img
                        src="/images/overtimeLogo_bien.png"
                        alt="logo de overtime basquet"
                        className="mx-auto py-5 w-9"
                    />

                    <img
                        src="/overtime.png"
                        alt="logo de overtime basquet"
                        className="mx-auto mt-12 mb-6 max-w-[400px] w-[70%] "
                    />

                    <div className="flex items-center justify-evenly mb-12">
                        <a href="https://tiktok.com" target="_blank">
                            <img
                                src="/logos - iconos/Tik Tok.png"
                                alt="tiktok"
                                className="w-12"
                            />
                        </a>
                        <a
                            href="https://www.youtube.com/@mediaovertime"
                            target="_blank"
                        >
                            <img
                                src="/logos - iconos/Youtube.png"
                                alt="youtube"
                                className="w-12"
                            />
                        </a>
                        <a
                            href="https://www.instagram.com/overtime.basquet/?hl=es"
                            target="_blank"
                        >
                            <img
                                src="/logos - iconos/Instagram.png"
                                alt="Instagram"
                                className="w-12"
                            />
                        </a>
                    </div>

                    <MenuItem titulo="inicio" link="/" />
                    <MenuItem titulo="torneos 2022">
                        {menu.map((data, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    titulo={data.label}
                                    link={data.chldren ? null : data.label}
                                    level="4"
                                >
                                    {data.children?.map(
                                        (child, indexChildren) => {
                                            return (
                                                <MenuItem
                                                    level="8"
                                                    key={indexChildren}
                                                    titulo={child.label}
                                                    link={{
                                                        pathname:
                                                            '/subtournament/[id]',
                                                        query: {
                                                            id: child.key,
                                                            tournament:
                                                                data.key,
                                                        },
                                                    }}
                                                    bold={false}
                                                />
                                            );
                                        }
                                    )}
                                </MenuItem>
                            );
                        })}
                    </MenuItem>
                    <MenuItem titulo="galería" link="/proximamente" />
                    <MenuItem titulo="inscribite" link="/proximamente" />
                    <MenuItem titulo="contacto" link="/proximamente" />
                    <MenuItem titulo="palmarés" link="/proximamente" />
                    <MenuItem
                        titulo="torneos archivados"
                        link="/proximamente"
                    />
                </nav>
            </header>

            <main className="text-blanco min-h-[91vh] lg:min-h-[94vh]">
                {children}
            </main>
            {/* FOOTER */}
        </>
    );
};

function MenuItem(props) {
    let { titulo, link, level, children, bold = true } = props;

    const [isShownChildren, setChildren] = useState(false);

    function toggleChildren() {
        setChildren(!isShownChildren);
    }

    return (
        <div
            className={`text-naranja font-bold  max-w-full m-auto my-6 bg-menu relative`}
        >
            <div className="pl-4 pl-8 hidden"></div>

            {!children && (
                <Link
                    href={link}
                    className={
                        ` text-naranja w-[70vw] m-auto block uppercase pl-${level}` +
                        (bold ? ' font-bold' : '')
                    }
                >
                    {' '}
                    {titulo}{' '}
                </Link>
            )}

            {children && (
                <>
                    <button
                        onClick={toggleChildren}
                        className={
                            'flex items-center justify-between m-auto w-[70vw]'
                        }
                    >
                        <span
                            className={
                                `uppercase  pl-${level} ` +
                                (bold ? 'font-bold' : '')
                            }
                        >
                            {' '}
                            {titulo}{' '}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={
                                'w-6 h-6 transition-transform duration-300 ' +
                                (isShownChildren ? ' rotate-180' : ' rotate-0 ')
                            }
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </button>
                    <div
                        className={
                            ' gradient-purple-dark-vertical transition-all duration-200 py-3 my-3 ' +
                            (isShownChildren
                                ? ' translate-y-0 block  '
                                : ' -translate-y-full hidden ')
                        }
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

function MenuItemDesktop(props) {
    let { titulo, link, level, children, bold = true } = props;

    const [isShownChildren, setChildren] = useState(false);

    function toggleChildren() {
        setChildren(!isShownChildren);
    }

    return (
        <div
            className={`text-naranja font-bold  max-w-full m-auto py-2 bg-menu `}
        >
            <div className="pl-4 pl-8 hidden"></div>
            {!children && (
                <Link
                    href={link}
                    className={
                        `  m-auto block uppercase pl-${level}` +
                        (bold ? ' font-bold' : '')
                    }
                >
                    {' '}
                    {titulo}{' '}
                </Link>
            )}

            {children && (
                <>
                    <button
                        onClick={toggleChildren}
                        className={
                            'flex items-center justify-between w-full pr-3'
                        }
                    >
                        <span
                            className={
                                `uppercase  pl-${level} ` +
                                (bold ? 'font-bold' : '')
                            }
                        >
                            {' '}
                            {titulo}{' '}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={
                                'w-6 h-6 transition-transform duration-300 ' +
                                (isShownChildren ? ' rotate-180' : ' rotate-0 ')
                            }
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </button>
                    <div
                        className={
                            'gradient-purple-dark-vertical py-3 my-3 ' +
                            (isShownChildren
                                ? ' translate-y-0 opacity-100'
                                : ' hidden -translate-y-full ')
                        }
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

export default Layout;
