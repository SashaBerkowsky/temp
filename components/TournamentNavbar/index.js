import styles from './tournamentNavbar.module.scss';

const TournamentNavbar = ({ onTabChange, subTournamentOpts, currentTab }) => {
    const bgGradient =
        'linear-gradient(180deg, rgba(59, 51, 106, 0) 0%, rgba(59, 51, 106, 0.2) 100%)';

    return (
        <div className="bg-newbox shadow-xl">
            <div className="w-full sm:w-96 mx-auto">
                <div className="w-full flex justify-evenly">
                    {subTournamentOpts.map((opt, idx) => (
                        <div
                            onClick={() => onTabChange(idx)}
                            className={`w-1/3 h-10 cursor-pointer flex items-center justify-center ${
                                idx !== currentTab && 'opacity-60'
                            } uppercase ${
                                styles.tournamentNavbarComponent__item
                            }`}
                            style={
                                idx === currentTab
                                    ? { background: bgGradient }
                                    : {}
                            }
                            key={idx}
                        >
                            <div className="text-center text-naranja text-center font-din-display text-md sm:text-sm">
                                {opt}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default TournamentNavbar;
