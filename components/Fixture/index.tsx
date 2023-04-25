import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { MatchPreview, PlayoffPicker } from '../';
import { Match, Subtournament, Team } from '@types';
import styles from './fixtureComponent.module.scss';

type Props = {
    subtournamentData: Subtournament;
};

type ScrollbarProps = {
    slide: (offsetMultiplier: number, selectedTab: number) => void;
    tabAmount: number;
    currentTab: number;
};

type MatchByBracket = {
    [bracket: string | number]: Match[];
};

const sortMatchesByBracket = (matches: Match[]): MatchByBracket => {
    const groupedMatches: MatchByBracket = {};
    matches?.forEach((match) => {
        if (groupedMatches[match.round]) {
            groupedMatches[match.round].push(match);
        } else {
            groupedMatches[match.round] = [match];
        }
    });
    return groupedMatches;
};

const findTeam = (teams, teamID) => teams.find((team) => team._id === teamID);

const Fixture = ({ subtournamentData }: Props) => {
    const router = useRouter();

    const matchesByBracket: MatchByBracket = sortMatchesByBracket(
        subtournamentData?.matches
    );
    const loadBrackets = (): string[] | number[] => {
        return subtournamentData?.isPlayoff
            ? subtournamentData.playoffConfig?.datesNames
            : Object.keys(matchesByBracket).map((key) => key);
    };
    const brackets: string[] | number[] = loadBrackets();
    const [roundNumber, setRoundNumber] = useState<number>(brackets.length - 1);
    const [roundNumber2, setRoundNumber2] = useState<number>(
        brackets.length - 1
    );

    return (
        <div className={styles.fixtureComponent__container}>
            <div className={styles.fixtureComponent__matches}>
                {subtournamentData.zones && (
                    <div className={styles.fixtureComponent__zoneheader}>
                        <h2>Zona A</h2>
                    </div>
                )}
                {subtournamentData?.last6Matches && (
                    <div className={styles.fixtureComponent__section}>
                        <h3>Últimos Partidos</h3>
                        <ScrollPreview
                            matches={subtournamentData.last6Matches}
                            teams={subtournamentData.teams}
                        />
                    </div>
                )}
                {subtournamentData?.next6Matches && (
                    <div className={styles.fixtureComponent__section}>
                        <h3>Próximos Partidos</h3>
                        <ScrollPreview
                            matches={subtournamentData.next6Matches}
                            teams={subtournamentData.teams}
                        />
                    </div>
                )}
                <div className={styles.fixtureComponent__section}>
                    <h3>Fixture</h3>
                    <div className={styles.fixtureComponent__picker}>
                        <PlayoffPicker
                            brackets={brackets}
                            selectedItem={roundNumber}
                            onChange={setRoundNumber}
                            isPlayoff={subtournamentData.isPlayoff}
                        />
                    </div>

                    <div className={styles.fixtureComponent__stageContainer}>
                        {matchesByBracket[brackets[roundNumber]]?.map(
                            (m, i) => (
                                <MatchPreview
                                    matchData={m}
                                    team1={findTeam(
                                        subtournamentData.teams,
                                        m.team1
                                    )}
                                    team2={findTeam(
                                        subtournamentData.teams,
                                        m.team2
                                    )}
                                    key={i}
                                />
                            )
                        )}
                    </div>
                </div>
                {subtournamentData.zones && (
                    <div>
                        <div className={styles.fixtureComponent__zoneheader}>
                            <h2>Zona B</h2>
                        </div>
                        <div className={styles.fixtureComponent__section}>
                            <h3>Últimos Partidos</h3>
                            <ScrollPreview
                                matches={subtournamentData.matches}
                                teams={subtournamentData.teams2}
                            />
                        </div>
                        <div className={styles.fixtureComponent__section}>
                            <h3>Próximos Partidos</h3>
                            <ScrollPreview
                                matches={subtournamentData.matches}
                                teams={subtournamentData.teams2}
                            />
                        </div>
                        <div className={styles.fixtureComponent__section}>
                            <h3>Fixture</h3>
                            <div className={styles.fixtureComponent__picker}>
                                <PlayoffPicker
                                    brackets={brackets}
                                    selectedItem={roundNumber2}
                                    onChange={setRoundNumber2}
                                    isPlayoff={subtournamentData.isPlayoff}
                                />
                            </div>

                            <div
                                className={
                                    styles.fixtureComponent__stageContainer
                                }
                            >
                                {matchesByBracket[brackets[roundNumber]]?.map(
                                    (m) => (
                                        <MatchPreview
                                            matchData={m}
                                            team1={findTeam(
                                                subtournamentData.teams2,
                                                m.team1
                                            )}
                                            team2={findTeam(
                                                subtournamentData.teams2,
                                                m.team2
                                            )}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/*
        
                    <div className={styles.fixtureComponent__gallerycont}>
                        <h3>fotos de la fecha</h3>
                        <button
                            onClick={() => {
                                router.replace({
                                    query: { ...router.query, selectedTab: 'galería' },
                                });
                            }}
                        >
                            <strong>Ver Galería</strong>
                        </button>
                        <div className={styles.fixtureComponent__galleryprev}>
                            {[...Array(5)].map((item, i) => (
                                <img
                                    src="/images/game-placeholder.jpeg"
                                    className={styles.fixtureComponent__galleryimg}
                                />
                            ))}
                        </div>
                    </div>
                */}
        </div>
    );
};
const Scrollbar = ({ slide, tabAmount, currentTab }: ScrollbarProps) => {
    const handleItemChange = (itemIdx: number): void => {
        if (itemIdx !== currentTab) {
            slide(itemIdx - currentTab, itemIdx);
        }
    };

    return (
        <div className={styles.fixtureComponent__scrollbar}>
            {[...Array(tabAmount)].map((e, i) => (
                <span
                    className={
                        currentTab === i
                            ? styles.fixtureComponent__scrollitemS
                            : styles.fixtureComponent__scrollitem
                    }
                    onClick={() => handleItemChange(i)}
                    key={i}
                />
            ))}
        </div>
    );
};

const ScrollPreview = ({ matches, teams }) => {
    const tabBreakpoint = 1200;
    const ref = useRef(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth === tabBreakpoint) {
                ref.current.scrollLeft = 0;
                setCurrentTab(0);
            }
        };
        if (!windowWidth) {
            handleWindowResize();
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    const handleSlide = (
        offsetMultiplier: number,
        selectedTab: number
    ): void => {
        const offset = -10;
        if (windowWidth >= tabBreakpoint) {
            ref.current.scrollLeft +=
                (ref.current.clientWidth + offset) * offsetMultiplier;
        } else if (windowWidth >= 475) {
            ref.current.scrollLeft += 475 * offsetMultiplier;
        } else {
            ref.current.scrollLeft += 380 * offsetMultiplier;
        }

        setCurrentTab(selectedTab);
    };

    return (
        <div className={styles.previewContainer}>
            <Scrollbar
                slide={handleSlide}
                tabAmount={
                    matches.length === 0
                        ? 0
                        : windowWidth >= tabBreakpoint
                        ? Math.ceil(matches.length / 2)
                        : matches.length - 1
                }
                currentTab={currentTab}
            />
            <div className={styles.previewScroll} ref={ref}>
                {matches.map((match, idx) => (
                    <MatchPreview
                        matchData={match}
                        team1={findTeam(teams, match.team1)}
                        team2={findTeam(teams, match.team2)}
                        key={idx}
                    />
                ))}
            </div>
        </div>
    );
};

export default Fixture;
