import { useEffect } from 'react';

type ModalProps = {
    show: boolean;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
};

const ModalConfirm = ({ show, message, onCancel, onConfirm }: ModalProps) => {
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
                <div className="p-4 text-center text-naranja">
                    <h1 className="uppercase text-xl font-Helvetica leading-4 pb-2">
                        ¿Esta seguro?
                    </h1>
                    <hr />
                    <p className="text-md font-Helvetica px-4 pt-3 leading-5">
                        {message}
                    </p>
                    <p className="text-md font-Helvetica leading-4 py-4">
                        ¿Desea continuar?
                    </p>
                    <div className="flex justify-center gap-5 h-8 ">
                        <button
                            className="w-24 border-naranja border-2 text-naranja font-bold uppercase rounded-md font-din-display "
                            onClick={() => onCancel()}
                        >
                            Cancelar
                        </button>
                        <button
                            className="w-24 border-naranja border-2 bg-naranja font-bold uppercase rounded-md font-din-display text-blanco"
                            onClick={() => onConfirm()}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
