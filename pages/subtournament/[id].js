import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
    Fixture,
    Gallery,
    Layout,
    Positions,
    TournamentHeader,
    TournamentNavbar,
    NotFound,
} from '../../components';
import apiUrl from '../../constants/apiUrl';

export default function Tournament({
    tableData,
    tournamentData,
    subtournamentData,
    id,
}) {
    const [currentTab, setCurrentTab] = useState(0);
    const router = useRouter();
    const startingTab = router.query.selectedTab;
    const subTournamentOpts = ['fixture', 'posiciones', 'galería'];

    useEffect(() => {
        const tabNumber = subTournamentOpts.indexOf(startingTab);
        setCurrentTab(tabNumber >= 0 ? tabNumber : 0);
    }, [startingTab, router.query.selectedTab]);

    const handleTabChange = (value) => {
        setCurrentTab(value);
    };

    const getCurrentTab = () => {
        switch (currentTab) {
            case 0:
                return <Fixture subtournamentData={subtournamentData} />;
                break;
            case 1:
                return (
                    <Positions
                        table={tableData?.table}
                        top3ScorersTeams={tableData?.top3ScorersTeams}
                        top3ConcededTeams={tableData?.top3ConcededTeams}
                        topScorers={tableData?.topScorers}
                    />
                );
                break;
            case 2:
                return <Gallery />;
                break;
            default:
                return <Fixture />;
        }
    };

    return (
        <>
            <Layout title={subtournamentData.name}>
                {subtournamentData && tournamentData ? (
                    <div className="w-full min-h-[94vh]">
                        <TournamentHeader
                            tournament={tournamentData.name}
                            subtournament={subtournamentData.name}
                        />
                        <TournamentNavbar
                            onTabChange={handleTabChange}
                            subTournamentOpts={subTournamentOpts}
                            currentTab={currentTab}
                        />
                        <div className="pt-[65px] bg-fondo min-h-[80vh]">
                            {getCurrentTab()}
                        </div>
                    </div>
                ) : (
                    <NotFound message="Torneo no encontrado" />
                )}
            </Layout>
        </>
    );
}
export async function getServerSideProps(context) {
    const subtournamentRes = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.id}`
    );
    const tableRes = await fetch(
        `${apiUrl}/tournaments/${context.query.tournament}/subtournaments/${context.query.id}/table`
    );
    const { tournament, subtournament, next6Matches, last6Matches } =
        await subtournamentRes.json();
    const tableData = await tableRes.json();

    return {
        props: {
            subtournamentData: subtournament
                ? { ...subtournament, next6Matches, last6Matches }
                : false,
            tournamentData: tournament ? tournament : false,
            tableData: tableData ? tableData : false,
        },
    };
}
