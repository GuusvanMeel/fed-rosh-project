    import React from 'react';

    interface Team {
    name: string;
    score?: number;
    logoUrl?: string;
    }

    interface Match {
    id: number;
    teams: [Team, Team];
    winner?: Team;
    date?: string;
    }

    interface Round {
    title: string;
    matches: Match[];
    }

    const TeamDisplay = ({ team, isWinner }: { team: Team; isWinner: boolean }) => (
    <div className={`flex items-center justify-between p-2 rounded transition-colors ${
        isWinner 
        ? 'bg-green-600/20 border border-green-500' 
        : 'bg-gray-800/50 border border-gray-600'
    }`}>
        <div className="flex items-center gap-2">
        {team.logoUrl && (
            <img 
            src={team.logoUrl} 
            alt={team.name} 
            className="w-5 h-5 rounded-full object-cover border border-gray-500"
            onError={(e) => {
                e.currentTarget.src = "/globe.svg";
            }}
            />
        )}
        <span className={`text-sm font-medium ${isWinner ? 'text-green-300' : 'text-white'}`}>
            {team.name}
        </span>
        </div>
        {team.score !== undefined && (
        <span className={`text-sm font-bold px-2 py-1 rounded ${
            isWinner 
            ? 'text-green-300 bg-green-500/20' 
            : 'text-yellow-400 bg-yellow-400/10'
        }`}>
            {team.score}
        </span>
        )}
    </div>
    );

    const MatchDisplay = ({ match }: { match: Match }) => (
    <div className="bg-gray-900/70 rounded-lg border border-gray-700 p-3 min-w-[200px]">
        <div className="space-y-1">
        {match.teams.map((team, index) => (
            <TeamDisplay 
            key={`${match.id}-${index}`} 
            team={team} 
            isWinner={match.winner?.name === team.name} 
            />
        ))}
        </div>
        {match.date && (
        <div className="text-xs text-gray-400 text-center mt-2">
            {new Date(match.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
            })}
        </div>
        )}
    </div>
    );



 export const BracketWrapper = ({ rounds }: { rounds: Round[] }) => {
  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <div className="flex items-start gap-6 w-full h-full">
        {rounds.map((round) => {
          const matchCount = round.matches.length;
          // total height of parent container
          // give 5-10% padding between matches
          const matchHeight = `calc(${100 / matchCount}% - ${8 / matchCount}%)`;

          return (
            <div
              key={round.title}
              className="flex flex-col items-center flex-0"
              style={{ height: '100%' }}
            >
              <h3 className="text-sm font-semibold text-white text-center mb-2 pb-1 border-b border-gray-600 w-full">
                {round.title}
              </h3>

              <div className="flex flex-col justify-start w-full h-full">
                {round.matches.map((match, index) => (
                  <div
                    key={match.id}
                    className="flex justify-center items-center w-full"
                    style={{
                      height: matchHeight,
                      marginTop: index === 0 ? 0 : '4px',
                      marginBottom: index === matchCount - 1 ? 0 : '4px',
                    }}
                  >
                    <MatchDisplay match={match} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};




    export const rounds: Round[] = [
    {
        title: "Quarterfinals",
        matches: [
        {
            id: 1,
            teams: [
            { name: "Red Dragons", score: 3, logoUrl: "/globe.svg" },
            { name: "Blue Sharks", score: 1, logoUrl: "/globe.svg" }
            ],
            winner: { name: "Red Dragons", score: 3 },
            date: "2025-01-10"
        },
        {
            id: 2,
            teams: [
            { name: "Green Giants", score: 2, logoUrl: "/globe.svg" },
            { name: "Yellow Tigers", score: 4, logoUrl: "/globe.svg" }
            ],
            winner: { name: "Yellow Tigers", score: 4 },
            date: "2025-01-10"
        },
        {
            id: 3,
            teams: [
            { name: "Black Panthers", score: 1, logoUrl: "/globe.svg" },
            { name: "White Wolves", score: 2, logoUrl: "/globe.svg" }
            ],
            winner: { name: "White Wolves", score: 2 },
            date: "2025-01-11"
        }
        ]
    },
    {
        title: "Semifinals",
        matches: [
        {
            id: 5,
            teams: [
            { name: "Red Dragons", score: 2, logoUrl: "/globe.svg" },
            { name: "Yellow Tigers", score: 3, logoUrl: "/globe.svg" }
            ],
            winner: { name: "Yellow Tigers", score: 3 },
            date: "2025-01-15"
        },
        {
            id: 6,
            teams: [
            { name: "White Wolves", score: 1, logoUrl: "/globe.svg" },
            { name: "Orange Lions", score: 4, logoUrl: "/globe.svg" }
            ],
            winner: { name: "Orange Lions", score: 4 },
            date: "2025-01-15"
        },
        ]
    },
    {
        title: "Final",
        matches: [
        {
            id: 7,
            teams: [
            { name: "Yellow Tigers", score: 5, logoUrl: "/globe.svg" },
            { name: "Red Dragons", score: 4, logoUrl: "/globe.svg" }
            ],
            winner: { name: "Yellow Tigers", score: 5 },
            date: "2025-01-20"
        }
        ]
    }
    ];
