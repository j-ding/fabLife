import React, { useContext, useState } from 'react';
import { CardContext } from '../context/CardContext';

const HeroSelector = ({ onSelectHero, isPlayer }) => {
  const { heroes, loading, gameFormat } = useContext(CardContext);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter heroes based on search term
  const filteredHeroes = heroes.filter(hero => 
    hero.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return <div className="p-4 text-center">Loading heroes...</div>;
  }
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Search heroes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredHeroes.map(hero => (
          <button
            key={hero._id}
            className="p-4 bg-gray-800 rounded-lg flex flex-col items-center hover:bg-gray-700"
            onClick={() => onSelectHero(hero)}
          >
            <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 flex items-center justify-center">
              {hero.name.charAt(0)}
            </div>
            <span className="font-medium text-center">{hero.name}</span>
            <span className="text-xs text-gray-400">HP: {hero.base_health}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSelector;