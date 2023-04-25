import LeaderboardItem from './components/LeaderboardItem';

const Leaderboard = ({ table }) => {
    const getPositionBackground = (idx) => {
        if (idx === 0) return 'bg-violeta bg-opacity-80 ';
        if (idx % 2 === 0) return 'bg-newvioleta ';
        if (idx % 2 === 1) return 'bg-newbox ';
    };
    const getPositionColor = (idx) => {
        if (idx < 3) return 'text-naranja';
        if (idx < 7) return 'text-blanco opacity-60';
        return 'text-newvioleta-claro';
    };

    return (
        <div className="w-full uppercase shadow-lg">
            <div className="w-full flex h-10 pt-1 items-center bg-violeta text-Helvetica text-xs font-bold">
                <div className="w-1/12">#</div>
                <div className="w-7/12 col-span-7 text-start opacity-60">
                    equipo
                </div>
                <div className="w-4/12 h-full flex justify-around items-center opacity-60 bg-violeta">
                    <div>pj</div>
                    <div>pg</div>
                    <div>pp</div>
                    <div>dp</div>
                </div>
            </div>
            {table?.map((positionData, idx) => (
                <div key={idx}>
                    <LeaderboardItem
                        positionData={{ ...positionData, position: idx + 1 }}
                        bgColor={getPositionBackground(idx)}
                        positionColor={getPositionColor(idx)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;
