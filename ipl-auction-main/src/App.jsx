import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import PlayerAuction from './components/PlayerAuction';
import CategorySelector from './components/CategorySelector';
import TeamStats from './components/TeamStats';
import ThemeToggle from './components/ThemeToggle';

const AppContent = () => {
    const categories = [
        'Marquee Players',
        'Foreign Players',
        'Indian Players'
    ];

    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [showStats, setShowStats] = useState(false);
    const [auctionComplete, setAuctionComplete] = useState(false);
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

    const handleCategoryComplete = () => {
        const nextCategoryIndex = categories.indexOf(currentCategory) + 1;
        if (nextCategoryIndex < categories.length) {
            setCurrentCategory(categories[nextCategoryIndex]);
        } else {
            setAuctionComplete(true);
        }
    };

    if (auctionComplete) {
        return (
            <div className="auction-complete">
                <h1>IPL Auction Complete!</h1>
                <TeamStats teams={teams} isFullScreen={true} />
            </div>
        );
    }

    // Test if Tailwind is working
    if (process.env.NODE_ENV === 'development') {
        console.log('Testing Tailwind CSS...');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-4">
            {/* Test element - remove after verification */}
            <div className="test-tailwind mb-4 bg-red-500 text-white p-4 rounded-lg">
                If this is red with white text, Tailwind CSS is working!
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">IPL Auction 2024</h1>
                    <button 
                        onClick={() => setShowStats(!showStats)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                    >
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                </div>

                {showStats && <TeamStats teams={teams} />}

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                    <CategorySelector
                        categories={categories}
                        currentCategory={currentCategory}
                        onCategorySelect={setCurrentCategory}
                    />

                    <div className="mt-6">
                        <PlayerAuction
                            teams={teams}
                            setTeams={setTeams}
                            currentCategory={currentCategory}
                            onCategoryComplete={handleCategoryComplete}
                        />
                    </div>
                </div>
            </div>
            
            <ThemeToggle />
        </div>
    );
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App; 