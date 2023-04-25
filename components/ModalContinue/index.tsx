import { useEffect } from 'react';

type ModalProps = {
    show: boolean;
    message: string;
    onContinue: () => void;
};

const ModalContinue = ({ show, message, onContinue }: ModalProps) => {
    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : 'auto';
    }, [show]);

    return (
        <div
            className={`fixed flex w-screen h-screen z-40 items-center justify-center ${
                !show && 'invisible'
            }`}
        >
            <div className="w-96 bg-blanco rounded-lg border border-0.5 border-fondo">
                <div className="p-3 text-center text-naranja">
                    <p className="text-md font-Helvetica px-4 pb-3 leading-5">
                        {message}
                    </p>
                    <div className="flex justify-center gap-5 h-8 ">
                        <button
                            className="w-24 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display text-blanco"
                            onClick={() => onContinue()}
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalContinue;
