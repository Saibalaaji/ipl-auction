import React from 'react';

const TeamStats = ({ teams, isFullScreen = false }) => {
    const sortedTeams = [...teams].sort((a, b) => b.purse - a.purse);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(amount / 10000000).replace('₹', '₹ ');
    };

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 p-8 overflow-auto' : 'mb-8'} bg-white dark:bg-gray-800 rounded-xl shadow-lg`}>
            <div className={`${isFullScreen ? 'max-w-6xl mx-auto' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Statistics</h2>
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Teams: {teams.length}</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Team
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Purse Left
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Players
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Spent
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedTeams.map((team, index) => {
                                const spent = 100 - (team.purse / 10000000);
                                const spentPercentage = Math.max(0, Math.min(100, spent));
                                
                                return (
                                    <tr key={team.name} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {team.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{team.players.length} players</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(team.purse)} Cr
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                            {team.players.length}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-end">
                                                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                                                    <div 
                                                        className="bg-green-500 h-2.5 rounded-full" 
                                                        style={{ width: `${spentPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {spentPercentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamStats;