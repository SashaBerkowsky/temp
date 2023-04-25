const TournamentHeader = ({ tournament, subtournament }) => {
    return (
        <div className="bg-newbox h-28 font-Helvetica text-naranja text-center uppercase">
            <div className="flex flex-col gap-2 h-full items-center justify-center flex-wrap sm:flex-row">
                {tournament}
                <strong>{subtournament}</strong>
            </div>
        </div>
    );
};

export default TournamentHeader;
