import { IMAGE_URL } from '@constants';

const PlayerFrame = ({ position, data }) => {
    const bgGradients = [
        {
            background: 'linear-gradient(0deg, #3B336A 0%, #181525 100%)',
        },
        {
            background:
                'linear-gradient(0.96deg, #1F1B33 -1.23%, #181525 99.24%)',
        },
        {
            background: 'linear-gradient(0deg, #1c182c 0%, #181525 100%)',
        },
    ];

    return (
        <div
            className={`text-center w-1/3 ${
                position === 0 || position === 1 ? 'shadow-lg' : ''
            }
`}
            style={bgGradients[position]}
        >
            <img
                src={`${IMAGE_URL}/${data?.player?.picture}`}
                className="h-12 w-max mt-4 mb-5 mx-auto aspect-square object-contain"
                alt={`${position + 1} frame badge`}
            />
            <div className="row row-rows-1 h-2/3">
                <p className="h-12 font-Helvetica font-thin text-sm leading-4 uppercase">
                    {data?.player?.name}
                </p>
                <div className="h-16 my-2">
                    <img
                        src={`${IMAGE_URL}/${data?.team?.picture}`}
                        className="h-5 mb-2 mx-auto aspect-square object-contain"
                        alt={`${position + 1} badge`}
                    />
                    <p className="font-Helvetica font-thin text-sm opacity-50 leading-4 uppercase">
                        {data?.team?.name}
                    </p>
                </div>
                <div className="h-32 flex flex-col justify-between">
                    <div className="h-11">
                        <p className="font-Helvetica font-bold text-sm text-violeta uppercase">
                            ppp
                        </p>
                        <p
                            className={`leading-5 font-latin font-extrabold text-xl ${
                                position === 0 ? 'text-naranja' : ''
                            }`}
                        >
                            {(data?.points / data?.played).toFixed(1)}
                        </p>
                    </div>
                    <div className="h-11">
                        <p className="font-Helvetica font-bold text-sm text-violeta uppercase">
                            pt
                        </p>
                        <p
                            className={`leading-5 font-latin font-extrabold text-xl ${
                                position === 0 ? 'text-naranja' : ''
                            } `}
                        >
                            {data?.points}
                        </p>
                    </div>
                    <p
                        className={`font-latin text-sm ${
                            position === 0 ? 'text-naranja' : ''
                        } `}
                    >
                        {position + 1}
                    </p>
                </div>
            </div>
        </div>
    );
};

const TeamFrame = ({ position, data, type }) => {
    const bgGradients = [
        {
            background: 'linear-gradient(0deg, #3B336A 0%, #181525 100%)',
        },
        {
            background: 'linear-gradient(0deg, #1F1B33 -1.23%, #181525 99.24%)',
        },
        {
            background: 'linear-gradient(0deg, #1b182d 0%, #181525 100%)',
        },
    ];

    return (
        <div
            className={`text-center w-1/3 ${
                position === 0 || position === 1 ? 'shadow-lg' : ''
            }
`}
            style={bgGradients[position]}
        >
            <img
                src={`${IMAGE_URL}/${data?.team?.badge}`}
                className="h-1/4 w-max my-5 mx-auto aspect-square object-contain"
                alt={`${position + 1} frame badge`}
            />
            <div className="flex flex-col h-1/2 pt-0 justify-around">
                <p className="h-6 font-Helvetica font-thin text-sm leading-4 uppercase">
                    {data?.team?.name}
                </p>
                <p
                    className={`font-extrabold font-latin text-xl ${
                        position === 0 ? 'text-naranja' : ''
                    } `}
                >
                    {type === 'total' ? data.totalPoints : data.concededPoints}
                </p>
                <p
                    className={`font-latin text-sm ${
                        position === 0 ? 'text-naranja' : ''
                    } `}
                >
                    {position + 1}
                </p>
            </div>
        </div>
    );
};

type FrameProps = {
    position: number;
    variant: string;
    data: any;
    type?: string;
};

const FeaturedFrame = ({ position, variant, data, type }: FrameProps) => {
    // lo hago con un switch por si agregamos mas variantes en un futuro
    switch (variant) {
        case 'team':
            return <TeamFrame position={position} data={data} type={type} />;
            break;
        case 'player':
            return <PlayerFrame position={position} data={data} />;
            break;
    }
};

export default FeaturedFrame;
