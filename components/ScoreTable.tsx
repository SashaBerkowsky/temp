import { IMAGE_URL } from '@constants';
const ScoreTable = (props) => {
    const { naranja: local = true, players } = props;

    return (
        <div className="p-1 w-full rounded-md  max-w-sm">
            <div
                className={
                    '  text-blanco flex items-center text-[0.65rem] font-bold py-2 rounded-t-md font-Helvetica' +
                    (local ? ' bg-naranja' : ' bg-violeta')
                }
            >
                <div className="w-1/3"></div>

                <div className="uppercase px-3">jugador</div>
            </div>
            {players.map((player, index) => {
                const ultimaFila = index + 1 == players.length;

                return (
                    <div
                        className={
                            'flex w-full ' +
                            (local ? ' bg-box-naranja' : ' bg-negro-texto') +
                            (ultimaFila ? ' rounded-br-md' : '')
                        }
                        key={index}
                    >
                        <img
                            src={`${IMAGE_URL}/${player.player.picture}`}
                            alt=""
                            className={
                                'w-1/3 object-cover z-10' +
                                (ultimaFila ? ' rounded-bl-md' : '')
                            }
                        />
                        <div className="flex-1 flex flex-col">
                            <div className="flex w-full gap-3 px-3 py-2 ">
                                <div className="flex justify-between items-center w-full ">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="font-din-display text-xs pl-0.5 lg:pl-1.5">
                                            {player.player.name}
                                        </span>
                                        {   
                                            player.captain &&
                                            <div className="border border-blanco h-4 px-2.5 flex items-center">
                                                <div className=" font-latin text-xs mb-0.5 ">
                                                    {' '}
                                                    c{' '}
                                                </div>
                                            </div>
                                        }      
                                    </div>

                                    {player.mvp && (
                                        <img
                                            src="/logos - iconos/Jugador del partido.png"
                                            alt=""
                                            className="w-4 h-4 mr-1 lg:mr-3"
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                className={
                                    'flex h-full ' +
                                    (local
                                        ? ' gradient-naranja-opacity'
                                        : ' gradient-violeta-opacity') +
                                    (ultimaFila ? ' rounded-br-md' : '')
                                }
                            >

                                <div
                                    className={
                                        'flex flex-col justify-center items-center py-1  w-1/4 text-[0.65rem] relative' 
                                    }
                                >
                                    <div
                                        className={
                                            'uppercase font-Helvetica font-bold z-10' +
                                            (local
                                                ? ' text-naranja'
                                                : ' text-newvioleta-claro')
                                        }
                                    >
                                        pts
                                        
                                    </div>
                                    <div className="font-latin opacity-80 z-10">
                                        {' '}
                                        {player.totalScore || '-'}{' '}
                                    </div>
                                    <div className={'absolute pts w-[150%] h-full top-0 -left-6 z-0' +
                                        (local
                                            ? ' gradient-naranja-opacity-invert'
                                            : ' gradient-violeta-opacity-invert')  }></div>
                                </div>
                                <div className="text-[0.65rem] flex flex-1 ">
                                  

                                    <div className="flex flex-col justify-center items-center py-1  w-1/3">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            TL
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.pt1 || '-'}{' '}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center py-1  w-1/3">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            TC 2P
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.pt2 || '-'}{' '}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center py-1  w-1/3">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            TC 3P
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.pt3 || '-'}{' '}
                                        </div>
                                    </div>

                                   
                                </div>
                            </div>
                            <div
                                className={
                                    'flex h-full ' +
                                    (local
                                        ? ' gradient-naranja-opacity-invert '
                                        : ' gradient-violeta-opacity-invert') +
                                    (ultimaFila ? ' rounded-br-md' : '')
                                }
                            >
                                <div className="text-[0.65rem] flex flex-1 ">
                                    <div className="flex flex-col justify-center items-center py-1 px-2 w-1/4">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            fal
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {player.fouls || '-'}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center py-1 px-2 w-1/4">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            rob
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.steals || '-'}{' '}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center py-1 px-2 w-1/4">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            reb
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.rebounds || '-'}{' '}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-center py-1 px-2 w-1/4">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            as
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.assists || '-'}{' '}
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScoreTable;
