import { Html } from 'next/document';
import { LoadingScreen } from '../components';
import { LoadingProvider } from '../context/LoadingContext';
import '../styles/global.scss';
import localFont from '@next/font/local';


const FixtureBlack = localFont({
    src: '../assets/fonts/fixture/Fixture-Black.otf',
    display: 'swap',
    weight: '400',
    variable: '--fixture-black'
});

const FixtureUltra = localFont({
    src: '../assets/fonts/fixture/Fixture Ultra Regular.otf',
    display: 'swap',
    weight: '700',
    variable: '--fixture-ultra'
});

const Helvetica = localFont({
    src: [
        {
            path: '../assets/fonts/helvetica/HelveticaNeueLTStd-Cn.otf',
            weight: '100',
            style: 'normal',

        },
        {
            path: '../assets/fonts/helvetica/HelveticaNeueLTStd-Ex.otf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../assets/fonts/helvetica/HelveticaNeueLTStd-BdEx.otf',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--helvetica',
    display: 'swap',
})

const DinDisplay = localFont({
    src: [
        {
            path: '../assets/fonts/PF Din Display Pro/PFDinDisplayPro-Reg.ttf',
            weight: '400',
            style: 'normal',

        },
        {
            path: '../assets/fonts/PF Din Display Pro/PFDinDisplayPro-Med.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../assets/fonts/PF Din Display Pro/PFDinDisplayPro-Bold.ttf',
            weight: '800',
            style: 'normal',
        },
    ],
    variable: '--din-display',
    display: 'swap',
})

const Latin = localFont({
    src: [
        {
            path: '../assets/fonts/946 Latin/946Latin-Wide3.otf',
            weight: '200',
            style: 'thin',
        },
        {
            path: '../assets/fonts/946 Latin/946Latin-Regular4.otf',
            weight: '700',
            style: 'bold',
        },
    ],
    variable: '--latin',
    display: 'swap',
})

export default function App({ Component, pageProps }) {
    return (
        <div className={`${FixtureUltra.variable} ${FixtureBlack.variable} ${Helvetica.variable} ${DinDisplay.variable} ${Latin.variable}`}>
            <LoadingProvider>
                <LoadingScreen />
                <Component {...pageProps} />
            </LoadingProvider>
        </div>
    );
}
