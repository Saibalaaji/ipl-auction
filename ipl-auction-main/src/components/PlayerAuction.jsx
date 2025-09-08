import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTheme } from '../context/ThemeContext';

const PlayerAuction = ({ currentCategory, onCategoryComplete }) => {
    const { theme } = useTheme();
    const [currentBid, setCurrentBid] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [teams, setTeams] = useState([
        { name: 'Chennai Super Kings', purse: 1000000000, players: [] },
        { name: 'Delhi Capitals', purse: 1000000000, players: [] },
        { name: 'Gujarat Titans', purse: 1000000000, players: [] },
        { name: 'Kolkata Knight Riders', purse: 1000000000, players: [] },
        { name: 'Lucknow Super Giants', purse: 1000000000, players: [] },
        { name: 'Mumbai Indians', purse: 1000000000, players: [] },
        { name: 'Punjab Kings', purse: 1000000000, players: [] },
        { name: 'Rajasthan Royals', purse: 1000000000, players: [] },
        { name: 'Royal Challengers Bangalore', purse: 1000000000, players: [] },
        { name: 'Sunrisers Hyderabad', purse: 1000000000, players: [] }
    ]);

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const response = await fetch('/players.csv');
                const csvText = await response.text();
                
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsedPlayers = results.data.map(player => ({
                            Name: player.Name,
                            Category: player.Category,
                            Role: player.Role,
                            BasePrice: parseInt(player.BasePrice),
                            Points: parseInt(player.Points),
                            Country: player.Country,
                            stats: {
                                matches: parseInt(player.Matches),
                                runs: parseInt(player.Runs),
                                average: parseFloat(player.Average),
                                strikeRate: parseFloat(player.StrikeRate)
                            }
                        }));
                        setPlayers(parsedPlayers);
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error('Error loading players:', err);
                setLoading(false);
            }
        };

        loadPlayers();
    }, []);

    const handleBid = () => {
        if (currentBid === 0) {
            // If it's the first bid, start with base price
            const basePrice = players[currentPlayerIndex]?.BasePrice || 0;
            setCurrentBid(basePrice);
        } else {
            // Increment by 1 Cr (10000000)
            setCurrentBid(prev => prev + 10000000);
        }
    };

    const handleTeamSelect = (e) => {
        setSelectedTeam(e.target.value);
    };

    const handleSold = () => {
        if (selectedTeam && currentBid > 0) {
            setTeams(prevTeams => prevTeams.map(team => {
                if (team.name === selectedTeam) {
                    return {
                        ...team,
                        purse: team.purse - currentBid,
                        players: [...team.players, { ...players[currentPlayerIndex], soldFor: currentBid }]
                    };
                }
                return team;
            }));
            
            // Move to next player
            setCurrentPlayerIndex(prev => prev + 1);
            // Reset bid and selection
            setCurrentBid(0);
            setSelectedTeam('');
        }
    };

    const handleSkip = () => {
        setCurrentPlayerIndex(prev => prev + 1);
        setCurrentBid(0);
        setSelectedTeam('');
    };

    // Filter players by current category
    const filteredPlayers = players.filter(player => player.Category === currentCategory);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Loading players...</span>
            </div>
        );
    }

    if (filteredPlayers.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No players found in this category.</p>
            </div>
        );
    }

    // Check if we've gone through all players in this category
    if (currentPlayerIndex >= filteredPlayers.length) {
        // Call the completion handler if this was the last player in the category
        if (onCategoryComplete) {
            onCategoryComplete();
        }
        return (
            <div className="text-center py-12">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-6 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-2">Category Complete!</h3>
                    <p className="mb-4">All players in the {currentCategory} category have been auctioned.</p>
                    <button 
                        onClick={() => setCurrentPlayerIndex(0)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                        View Results
                    </button>
                </div>
            </div>
        );
    }

    const currentPlayer = filteredPlayers[currentPlayerIndex];
    
    // Handle auction completion
    if (currentPlayerIndex >= filteredPlayers.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Auction Complete for {currentCategory}!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {teams.map(team => (
                        <div key={team.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Remaining: ₹{(team.purse / 10000000).toFixed(2)} Cr
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                Players: {team.players.length}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Player Card */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentPlayer.Name}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                    {currentPlayer.Role}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                                    {currentPlayer.Category}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                                    {currentPlayer.Country}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {currentPlayer.Points} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">points</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Base Price: ₹{(currentPlayer.BasePrice / 10000000).toFixed(2)} Cr</div>
                        </div>
                    </div>

                    {/* Player Stats */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Matches</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{currentPlayer.stats.matches}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Runs</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{currentPlayer.stats.runs.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Average</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{currentPlayer.stats.average}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Strike Rate</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{currentPlayer.stats.strikeRate}</div>
                        </div>
                    </div>
                </div>

                {/* Bidding Section */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{(currentBid / 10000000).toFixed(2)} Cr
                                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        {currentBid === 0 ? 'No bids yet' : 'Current Bid'}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleBid}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                                    disabled={selectedTeam && teams.find(t => t.name === selectedTeam)?.purse < (currentBid + 10000000)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    {currentBid === 0 ? 'Start Bidding' : 'Bid +1 Cr'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                <select 
                                    value={selectedTeam} 
                                    onChange={handleTeamSelect}
                                    disabled={currentBid === 0}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 flex-1 min-w-0"
                                >
                                    <option value="">Select a team</option>
                                    {teams
                                        .filter(team => team.purse >= currentBid)
                                        .map(team => (
                                            <option key={team.name} value={team.name}>
                                                {team.name} (₹{(team.purse / 10000000).toFixed(2)} Cr left)
                                            </option>
                                        ))}
                                </select>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={handleSold}
                                        disabled={!selectedTeam || currentBid === 0}
                                        className={`px-4 py-2 rounded-md transition-colors flex-1 flex items-center justify-center ${
                                            !selectedTeam || currentBid === 0
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Sell
                                    </button>
                                    <button 
                                        onClick={handleSkip}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Navigation */}
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Player {currentPlayerIndex + 1} of {filteredPlayers.length}</span>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setCurrentPlayerIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentPlayerIndex === 0}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setCurrentPlayerIndex(prev => Math.min(filteredPlayers.length - 1, prev + 1))}
                        disabled={currentPlayerIndex >= filteredPlayers.length - 1}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerAuction; 