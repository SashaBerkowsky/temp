import { createContext, PropsWithChildren, useContext, useState } from 'react';

type LoadingCtx = {
    isLoading: boolean;
    changeLoading: (val: boolean) => void;
};

const ctx = createContext<LoadingCtx>({
    isLoading: false,
    changeLoading: () => undefined,
});

export const useLoading = () => useContext(ctx);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState<LoadingCtx['isLoading']>(false);

    const changeLoading: LoadingCtx['changeLoading'] = (value) => {
        setIsLoading(value);
    };

    return (
        <ctx.Provider
            value={{
                isLoading,
                changeLoading,
            }}
        >
            {children}
        </ctx.Provider>
    );
};
