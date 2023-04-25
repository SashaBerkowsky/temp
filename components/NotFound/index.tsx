type Props = {
    message: string;
};

const NotFound = ({ message }: Props) => {
    return (
        <div className="h-[94vh] my-auto w-full flex items-center justify-center font-Helvetica text-md text-naranja font-bold bg-fondo uppercase">
            <div>
                <img
                    src="../images/overtimeLogo_bien.png"
                    alt="logo de overtime"
                    className="mx-auto w-36 pb-6"
                />
                {message}
            </div>
        </div>
    );
};

export default NotFound;
