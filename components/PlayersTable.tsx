import { IMAGE_URL } from '@constants';

const PlayersTable = (props) => {
    const { naranja: local = true, players } = props;
    
    return (
        <div className="p-1 w-full rounded-md max-w-sm">
            <div
                className={
                    'text-blanco flex items-center text-[0.65rem] font-bold py-2 rounded-t-md font-Helvetica ' +
                    (local ? ' bg-naranja' : ' bg-violeta')
                }
            >
                <div className="w-1/3"></div>

                <div className="uppercase pl-3">jugador</div>
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
                            src={`${IMAGE_URL}/${player.picture}`}
                            alt=""
                            className={
                                'w-1/3 object-cover z-10 ' +
                                (ultimaFila ? ' rounded-bl-md' : '')
                            }
                        />
                        <div className="flex-1 flex flex-col">
                            <div className="flex w-full gap-3 px-3 py-2 h-10">
                                <div className="flex justify-between items-center w-full ">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="font-din-display text-xs ml-1 lg:ml-1.5">
                                            {' '}
                                            {player.name}{' '}
                                        </span>
                                    </div>
                                    <div className='text-newvioleta-claro text-xs'>
                                        <span className='font-latin mr-1 font-thin'>{player.played} </span>
                                        
                                        <span className='font-Helvetica font-bold' >PJ</span>
                                    </div>
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
                                        'flex flex-col justify-center items-center py-1  w-1/4 text-[0.60rem] relative' 
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
                                        p.pts
                                        
                                    </div>
                                    <div className="font-latin opacity-80 z-10">
                                        {' '}
                                        {player.played
                                                ? (
                                                      player.points /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}{' '}
                                    </div>
                                    <div className={'absolute pts w-[150%] h-full top-0 -left-7 z-0' +
                                        (local
                                            ? ' gradient-naranja-opacity-invert'
                                            : ' gradient-violeta-opacity-invert')  }></div>
                                </div>
                                <div className="text-[0.60rem] flex flex-1 ">
                                  

                                    <div className="flex flex-col justify-center items-center py-1  w-1/3">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                           P.TL
                                        </div>
                                        <div className="font-latin opacity-80 font-thin">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.pt1 /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}{' '}
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
                                           P.TC 2P
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.pt2 /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}{' '}
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
                                            P.TC 3P
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.pt3 /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}{' '}
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
                                <div className="text-[0.60rem] flex flex-1 ">
                                    <div className="flex flex-col justify-center items-center py-1 px-2 w-1/4">
                                        <div
                                            className={
                                                'uppercase font-Helvetica   font-bold' +
                                                (local
                                                    ? ' text-naranja'
                                                    : ' text-newvioleta-claro')
                                            }
                                        >
                                            p.fal
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {player.played
                                                ? (
                                                      player.fouls /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}
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
                                            p.rob
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.steals /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}
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
                                            p.reb
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.rebounds /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}
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
                                            p.as
                                        </div>
                                        <div className="font-latin opacity-80">
                                            {' '}
                                            {player.played
                                                ? (
                                                      player.assists /
                                                      player.played
                                                  ).toFixed(1)
                                                : '-'}{' '}
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

export default PlayersTable;

