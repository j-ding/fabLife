import React, { useState, useContext, useEffect } from 'react';
import { Heart, Menu, Plus, Minus, RotateCcw, Shield, Users, X } from 'lucide-react';
import { CardContext } from '../../context/CardContext';
import HeroSelector from '../HeroSelector';

const LifeTracker = () => {
  // Game format state
  const { gameFormat, updateGameFormat, heroes, loading } = useContext(CardContext);
  
  // Game state
  const [activeTab, setActiveTab] = useState('game');
  const [playerLife, setPlayerLife] = useState(gameFormat === 'blitz' ? 20 : 40);
  const [opponentLife, setOpponentLife] = useState(gameFormat === 'blitz' ? 20 : 40);
  
  // Life history tracking
  const [playerLifeHistory, setPlayerLifeHistory] = useState([
    { value: playerLife, change: 0, timestamp: new Date().toISOString(), note: 'Game started' }
  ]);
  const [opponentLifeHistory, setOpponentLifeHistory] = useState([
    { value: opponentLife, change: 0, timestamp: new Date().toISOString(), note: 'Game started' }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  
  // For tracking rapid changes
  const [lastPlayerChange, setLastPlayerChange] = useState({ time: 0, amount: 0 });
  const [lastOpponentChange, setLastOpponentChange] = useState({ time: 0, amount: 0 });
  const RAPID_CHANGE_THRESHOLD = 500; // milliseconds
  
  // Game session state
  const [hero, setHero] = useState('');
  const [opponentHero, setOpponentHero] = useState('');
  const [matchId, setMatchId] = useState(`match-${Date.now()}`);
  
  // Hero selection modal state
  const [showHeroSelector, setShowHeroSelector] = useState(false);
  const [selectingFor, setSelectingFor] = useState('player'); // 'player' or 'opponent'

  // Set initial heroes based on format when heroes are loaded
  useEffect(() => {
    if (!loading && heroes.length > 0) {
      // Select default heroes if none selected yet
      if (hero === '') {
        const defaultHero = heroes[0];
        setHero(defaultHero.name);
        setPlayerLife(defaultHero.base_health);
      }
      
      if (opponentHero === '') {
        const defaultOpponent = heroes.length > 1 ? heroes[1] : heroes[0];
        setOpponentHero(defaultOpponent.name);
        setOpponentLife(defaultOpponent.base_health);
      }
    }
  }, [loading, heroes, hero, opponentHero]);

  // Update life totals when game format changes
  useEffect(() => {
    if (gameFormat === 'blitz') {
      setPlayerLife(20);
      setOpponentLife(20);
    } else {
      setPlayerLife(40);
      setOpponentLife(40);
    }
    
    // Reset life history
    setPlayerLifeHistory([
      { value: gameFormat === 'blitz' ? 20 : 40, change: 0, timestamp: new Date().toISOString(), note: 'Game started' }
    ]);
    setOpponentLifeHistory([
      { value: gameFormat === 'blitz' ? 20 : 40, change: 0, timestamp: new Date().toISOString(), note: 'Game started' }
    ]);
  }, [gameFormat]);

  // Handle hero selection
  const handleSelectHero = (heroData) => {
    if (selectingFor === 'player') {
      setHero(heroData.name);
      setPlayerLife(heroData.base_health);
      setPlayerLifeHistory([
        { value: heroData.base_health, change: 0, timestamp: new Date().toISOString(), note: `Changed hero to ${heroData.name}` }
      ]);
    } else {
      setOpponentHero(heroData.name);
      setOpponentLife(heroData.base_health);
      setOpponentLifeHistory([
        { value: heroData.base_health, change: 0, timestamp: new Date().toISOString(), note: `Changed hero to ${heroData.name}` }
      ]);
    }
    setShowHeroSelector(false);
  };

  // Handle player life changes with rapid change detection
  const changePlayerLife = (amount) => {
    const newLife = Math.max(0, playerLife + amount);
    setPlayerLife(newLife);
    
    const now = Date.now();
    const timeDiff = now - lastPlayerChange.time;
    
    // Check if this is a rapid change (within threshold)
    if (timeDiff < RAPID_CHANGE_THRESHOLD && 
        (amount < 0 && lastPlayerChange.amount < 0) || 
        (amount > 0 && lastPlayerChange.amount > 0)) {
      // Update the last history entry instead of creating a new one
      const updatedHistory = [...playerLifeHistory];
      const lastEntry = updatedHistory.pop();
      
      const combinedChange = lastEntry.change + amount;
      
      updatedHistory.push({
        value: newLife,
        change: combinedChange,
        timestamp: new Date().toISOString(),
        note: ''
      });
      
      setPlayerLifeHistory(updatedHistory);
      setLastPlayerChange({ time: now, amount: combinedChange });
    } else {
      // Create a new history entry
      setPlayerLifeHistory([
        ...playerLifeHistory,
        { 
          value: newLife, 
          change: amount, 
          timestamp: new Date().toISOString(),
          note: ''
        }
      ]);
      setLastPlayerChange({ time: now, amount });
    }
  };

  // Handle opponent life changes with rapid change detection
  const changeOpponentLife = (amount) => {
    const newLife = Math.max(0, opponentLife + amount);
    setOpponentLife(newLife);
    
    const now = Date.now();
    const timeDiff = now - lastOpponentChange.time;
    
    // Check if this is a rapid change (within threshold)
    if (timeDiff < RAPID_CHANGE_THRESHOLD && 
        (amount < 0 && lastOpponentChange.amount < 0) || 
        (amount > 0 && lastOpponentChange.amount > 0)) {
      // Update the last history entry instead of creating a new one
      const updatedHistory = [...opponentLifeHistory];
      const lastEntry = updatedHistory.pop();
      
      const combinedChange = lastEntry.change + amount;
      
      updatedHistory.push({
        value: newLife,
        change: combinedChange,
        timestamp: new Date().toISOString(),
        note: ''
      });
      
      setOpponentLifeHistory(updatedHistory);
      setLastOpponentChange({ time: now, amount: combinedChange });
    } else {
      // Create a new history entry
      setOpponentLifeHistory([
        ...opponentLifeHistory,
        { 
          value: newLife, 
          change: amount, 
          timestamp: new Date().toISOString(),
          note: ''
        }
      ]);
      setLastOpponentChange({ time: now, amount });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 bg-red-900 shadow-lg flex justify-between items-center">
        <div className="flex items-center">
          <Menu className="mr-2" />
          <h1 className="text-xl font-bold">FaB Life Tracker</h1>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-red-800">
            <RotateCcw size={20} />
          </button>
          <button className="p-2 rounded-full bg-red-800">
            <Users size={20} />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'game' && (
          <div className="flex-1 flex flex-col">
            {/* Opponent Section (upside down) */}
            <div className="flex-1 flex flex-col items-center justify-center transform rotate-180 p-4 bg-gray-800 border-b-2 border-red-900">
              <div className="flex items-center mb-2">
                <button
                  className="text-lg font-semibold flex items-center" 
                  onClick={() => {
                    setSelectingFor('opponent');
                    setShowHeroSelector(true);
                  }}
                >
                  {opponentHero}
                  <span className="ml-1 text-xs opacity-60">▼</span>
                </button>
              </div>
              
              <div className="bg-gray-700 p-2 rounded-lg shadow-inner flex items-center mb-4">
                <Heart className="text-red-500 mr-2" size={24} />
                <span className="text-3xl font-bold">{opponentLife}</span>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className="p-3 rounded-full bg-red-800"
                  onClick={() => changeOpponentLife(-1)}
                >
                  <Minus size={24} />
                </button>
                <button 
                  className="p-3 rounded-full bg-green-700"
                  onClick={() => changeOpponentLife(1)}
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
            
            {/* Center Controls */}
            <div className="bg-black py-2 flex justify-center space-x-4">
              <button 
                className={`p-2 rounded-md ${gameFormat === 'blitz' ? 'bg-red-800' : 'bg-gray-700'}`}
                onClick={() => updateGameFormat('blitz')}
              >
                <span className="font-bold">B</span>
              </button>
              
              <button 
                className={`p-2 rounded-md ${gameFormat === 'cc' ? 'bg-red-800' : 'bg-gray-700'}`}
                onClick={() => updateGameFormat('cc')}
              >
                <span className="font-bold">C</span>
              </button>
              
              <button className="p-2 rounded-full bg-yellow-700">
                <Shield size={20} />
              </button>
              <button 
                className="p-2 rounded-full bg-blue-700"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? <X size={20} /> : <span className="text-xs font-bold">LOG</span>}
              </button>
            </div>
            
            {/* Player Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800">
              <div className="flex items-center mb-2">
                <button
                  className="text-lg font-semibold flex items-center" 
                  onClick={() => {
                    setSelectingFor('player');
                    setShowHeroSelector(true);
                  }}
                >
                  {hero}
                  <span className="ml-1 text-xs opacity-60">▼</span>
                </button>
              </div>
              
              <div className="bg-gray-700 p-2 rounded-lg shadow-inner flex items-center mb-4">
                <Heart className="text-red-500 mr-2" size={24} />
                <span className="text-3xl font-bold">{playerLife}</span>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className="p-4 rounded-full bg-red-800"
                  onClick={() => changePlayerLife(-1)}
                >
                  <Minus size={28} />
                </button>
                <button 
                  className="p-4 rounded-full bg-green-700"
                  onClick={() => changePlayerLife(1)}
                >
                  <Plus size={28} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'heroes' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Hero Selection</h2>
            <HeroSelector 
              onSelectHero={(hero) => handleSelectHero(hero)}
              isPlayer={true}
            />
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4">Match History</h2>
            
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gray-800 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold">Current Match</span>
                    <div className="text-sm text-gray-400">vs {opponentHero}</div>
                  </div>
                  <button 
                    className="p-2 bg-blue-700 rounded-md text-xs font-bold"
                    onClick={() => setShowHistory(true)}
                  >
                    VIEW LOG
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Started:</span> {new Date(playerLifeHistory[0].timestamp).toLocaleTimeString()}
                  </div>
                  <div>
                    <span className="text-green-500">{hero}</span> {playerLife} | {opponentLife} <span className="text-red-500">{opponentHero}</span>
                  </div>
                </div>
              </div>
              
              {/* Sample past matches - Replace with actual data from API */}
              <div className="bg-gray-800 rounded-lg p-3 mb-3 opacity-70">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold">match-1680215489</span>
                    <div className="text-sm text-gray-400">vs Bravo</div>
                  </div>
                  <button className="p-2 bg-blue-700 rounded-md text-xs font-bold">
                    VIEW LOG
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Completed:</span> Yesterday
                  </div>
                  <div className="font-medium">
                    <span className="text-green-500">Dorinthea</span> 0 | 20 <span className="text-red-500">Bravo</span>
                    <span className="ml-2 bg-red-900 px-2 py-1 rounded text-xs">DEFEAT</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 mb-3 opacity-70">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold">match-1680208277</span>
                    <div className="text-sm text-gray-400">vs Katsu</div>
                  </div>
                  <button className="p-2 bg-blue-700 rounded-md text-xs font-bold">
                    VIEW LOG
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Completed:</span> Yesterday
                  </div>
                  <div className="font-medium">
                    <span className="text-green-500">Dorinthea</span> 5 | 0 <span className="text-red-500">Katsu</span>
                    <span className="ml-2 bg-green-700 px-2 py-1 rounded text-xs">VICTORY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hero Selector Modal */}
        {showHeroSelector && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 z-20 flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Select {selectingFor === 'player' ? 'Your' : 'Opponent'} Hero
              </h2>
              <button 
                className="p-2 rounded-full bg-gray-700"
                onClick={() => setShowHeroSelector(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <HeroSelector 
              onSelectHero={handleSelectHero}
              isPlayer={selectingFor === 'player'}
            />
          </div>
        )}
        
        {/* Life History Log */}
        {showHistory && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 z-10 overflow-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Life History - {matchId}</h2>
              <button 
                className="p-2 rounded-full bg-gray-700"
                onClick={() => setShowHistory(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">You ({hero})</h3>
              <div className="bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
                {playerLifeHistory.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2 border-b border-gray-700 pb-2">
                    <div className="w-16 text-center font-mono">
                      <span className={entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-gray-400'}>
                        {entry.change > 0 ? `+${entry.change}` : entry.change}
                      </span>
                    </div>
                    <div className="w-16 text-center font-bold">{entry.value}</div>
                    <div className="flex-1 text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex-1 text-sm truncate">{entry.note}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Opponent ({opponentHero})</h3>
              <div className="bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
                {opponentLifeHistory.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2 border-b border-gray-700 pb-2">
                    <div className="w-16 text-center font-mono">
                      <span className={entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-gray-400'}>
                        {entry.change > 0 ? `+${entry.change}` : entry.change}
                      </span>
                    </div>
                    <div className="w-16 text-center font-bold">{entry.value}</div>
                    <div className="flex-1 text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex-1 text-sm truncate">{entry.note}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Match Details</h3>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between">
                  <span>Match ID:</span>
                  <span className="font-mono">{matchId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Started:</span>
                  <span>{new Date(playerLifeHistory[0].timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-gray-800 p-2 flex justify-around border-t border-red-900">
        <button 
          className={`p-2 rounded-md ${activeTab === 'game' ? 'bg-red-900' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Game
        </button>
        <button 
          className={`p-2 rounded-md ${activeTab === 'heroes' ? 'bg-red-900' : ''}`}
          onClick={() => setActiveTab('heroes')}
        >
          Heroes
        </button>
        <button 
          className={`p-2 rounded-md ${activeTab === 'stats' ? 'bg-red-900' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
        <button 
          className={`p-2 rounded-md ${activeTab === 'history' ? 'bg-red-900' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`p-2 rounded-md ${activeTab === 'cards' ? 'bg-red-900' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </button>
      </nav>
    </div>
  );
};

export default LifeTracker;