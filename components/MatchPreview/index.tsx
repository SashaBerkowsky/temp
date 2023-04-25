import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getDate, getTime } from '../../utils/dateFormat';
import { IMAGE_URL } from '@constants';
import styles from './matchPreview.module.scss';

const MatchPreview = ({ matchData, team1, team2 }) => {
    const router = useRouter();
    const formatDate = () => {
        return getDate(new Date(matchData.date));
    };
    const formatTime = () => {
        return getTime(new Date(matchData.date));
    };

    return (
        <>
            {matchData && team1 && team2 && (
                <div className={styles.matchPreview__container}>
                    <div className={styles.matchPreview__head}>
                        <div className={styles.matchPreview__typebg} />
                        <div className={styles.matchPreview__headData}>
                            <div className={styles.matchPreview__headsubtitle}>
                                <p className={styles.matchPreview__subtitletxt}>
                                    {`${
                                        matchData.date
                                            ? formatDate()
                                            : 'To be determined'
                                    } `}
                                    <strong>
                                        {matchData.date && formatTime()}
                                    </strong>
                                </p>
                            </div>
                            <div className={styles.matchPreview__headtitle}>
                                <h3>{matchData.matchType}</h3>
                            </div>
                            <div className={styles.matchPreview__headsubtitle}>
                                <p className={styles.matchPreview__subtitletxt}>
                                    {matchData.location
                                        ? matchData.location
                                        : 'To be determined'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.matchPreview__body}>
                        <div className={styles.matchPreview__match}>
                            <div
                                className={
                                    matchData.team1Score !== undefined &&
                                    matchData.team2Score !== undefined
                                        ? styles.matchPreview__score1bg
                                        : styles.matchPreview__pending1bg
                                }
                            />
                            <div
                                className={
                                    matchData.team1Score !== undefined &&
                                    matchData.team2Score !== undefined
                                        ? styles.matchPreview__score2bg
                                        : styles.matchPreview__pending2bg
                                }
                            />
                            <Link
                                className={styles.matchPreview__team}
                                href={`/team?tournament=${router.query.tournament}&team=${team1._id}`}
                                target="_blank"
                            >
                                <img
                                    className={styles.matchPreview__badge}
                                    src={`${IMAGE_URL}/${team1.badge}`}
                                />
                            </Link>
                            <div className={styles.matchPreview__score}>
                                <div
                                    className={
                                        matchData.team1Score !== undefined ||
                                        matchData.team2Score !== undefined
                                            ? styles.matchPreview__score1
                                            : styles.matchPreview__pendingScore
                                    }
                                >
                                    {matchData.team1Score !== undefined
                                        ? matchData.team1Score
                                        : '-'}
                                </div>
                                <div
                                    className={
                                        matchData.team1Score !== undefined ||
                                        matchData.team2Score !== undefined
                                            ? styles.matchPreview__score2
                                            : styles.matchPreview__pendingScore
                                    }
                                >
                                    {matchData.team2Score !== undefined
                                        ? matchData.team2Score
                                        : '-'}
                                </div>
                            </div>
                            <Link
                                className={styles.matchPreview__team}
                                href={`/team?tournament=${router.query.tournament}&team=${team2._id}`}
                                target="_blank"
                            >
                                <img
                                    className={styles.matchPreview__badge}
                                    src={`${IMAGE_URL}/${team2.badge}`}
                                />
                            </Link>
                        </div>
                        <div className={styles.matchPreview__names}>
                            <div className={styles.matchPreview__name}>
                                {team1.name}
                            </div>
                            <div className={styles.matchPreview__name}>
                                {team2.name}
                            </div>
                        </div>
                    </div>
                    {matchData.team1Score !== undefined &&
                    matchData.team2Score !== undefined ? (
                        <Link
                            href={`/matchStats?match=${matchData._id}&subtournament=${matchData.subtournamentId}&tournament=${router.query.tournament}`}
                            target="_blank"
                        >
                            <button className={styles.matchPreview__statsbtn}>
                                estadísticas
                            </button>
                        </Link>
                    ) : (
                        <div className={styles.matchPreview__pendinglbl}>
                            pediente
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default MatchPreview;
