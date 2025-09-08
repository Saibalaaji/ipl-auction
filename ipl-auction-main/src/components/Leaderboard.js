import React, { useState } from 'react';

const Leaderboard = ({ teams, isFinal }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Sort teams by total points
  const sortedTeams = [...teams].sort((a, b) => {
    const aPoints = a.players.reduce((sum, player) => sum + player.points, 0);
    const bPoints = b.players.reduce((sum, player) => sum + player.points, 0);
    if (bPoints === aPoints) {
      return b.purse - a.purse;
    }
    return bPoints - aPoints;
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {isFinal ? '🏆 Final Auction Results' : '📊 Current Standings'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeams.map((team, index) => {
          const totalPoints = team.players.reduce((sum, player) => sum + (player.points || 0), 0);
          
          return (
            <div 
              key={team.name} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-700' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                  </div>
                  <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                    {totalPoints} pts
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Purse Remaining</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{(team.purse / 10000000).toFixed(2)} Cr
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Players</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {team.players.length}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Squad</h3>
                <div className="space-y-2">
                  {team.players.map((player, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                        {player.Name || player.name}
                      </span>
                      <div className="flex space-x-3 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">{player.points || 0} pts</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ₹{((player.soldFor || player.BasePrice) / 10000000).toFixed(2)} Cr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard; 