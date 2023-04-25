import Link from 'next/link';
import { useRouter } from 'next/router';
import { IMAGE_URL } from '@constants';

const LeaderboardItem = ({ positionData, bgColor, positionColor }) => {
    const statsGradient =
        'linear-gradient(90deg, rgba(59, 51, 106, 0.3) 0%, rgba(59, 51, 106, 0) 100%)';
    const router = useRouter();
    const {
        team,
        matchesPlayed,
        matchesWon,
        matchesLost,
        pointsDifference,
        position,
    } = positionData;

    return (
        <div
            className={`${bgColor} flex w-full h-10 items-center font-latin text-sm font-bold`}
        >
            <div className={`${positionColor} w-1/12`}>{position}</div>
            <Link
                className="w-7/12 h-full font-thin font-Helvetica flex items-center gap-2"
                href={`/team?tournament=${router.query.tournament}&team=${team._id}`}
                target="_blank"
            >
                <img
                    className="w-6 aspect-square object-contain"
                    src={`${IMAGE_URL}/${team.badge}`}
                />
                <div className="mt-1">{team.name}</div>
            </Link>
            <div
                className="flex w-4/12 h-full items-center opacity-80 bg-blanco bg-opacity-20 font-thin"
                style={{ background: statsGradient }}
            >
                <div className="w-1/4">
                    {' '}
                    {!matchesPlayed && matchesPlayed !== 0
                        ? '-'
                        : matchesPlayed}
                </div>
                <div className="w-1/4">
                    {' '}
                    {!matchesWon && matchesWon !== 0 ? '-' : matchesWon}
                </div>
                <div className="w-1/4">
                    {' '}
                    {!matchesLost && matchesLost !== 0 ? '-' : matchesLost}
                </div>
                <div className="w-1/4">
                    {' '}
                    {!pointsDifference && pointsDifference !== 0
                        ? '-'
                        : pointsDifference}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardItem;
