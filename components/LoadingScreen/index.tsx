import { useLoading } from '@context/LoadingContext';

const LoadingScreen = () => {
    const { isLoading } = useLoading();
    return (
        <div
            className={`${
                isLoading ? 'fadeIn' : 'fadeOut'
            } fixed z-[9000] w-full h-full flex items-center justify-center bg-fondo bg-opacity-80`}
        >
            <div className="font-Helvetica font-bold text-naranja text-2xl text-center">
                <img
                    alt="logo overtime"
                    src="/images/overtimeLogo_bien.png"
                    className="w-1/6 mx-auto pb-4 animate-pulse"
                />
            </div>
        </div>
    );
};

export default LoadingScreen;
