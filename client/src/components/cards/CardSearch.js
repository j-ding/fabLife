import React, { useState, useEffect } from 'react';
import { searchCards } from '../../services/CardService';

const CardSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [heroClass, setHeroClass] = useState('');
  const [cardType, setCardType] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (searchTerm.length > 2 || heroClass || cardType) {
      handleSearch();
    }
  }, [searchTerm, heroClass, cardType, page]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchParams = {
        page,
        query: searchTerm,
        hero_class: heroClass || undefined,
        type: cardType || undefined
      };
      
      const data = await searchCards(searchParams);
      setResults(data.cards);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Card Search</h2>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Card Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cards..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Hero Class</label>
          <select 
            className="w-full p-2 border rounded"
            value={heroClass}
            onChange={(e) => setHeroClass(e.target.value)}
          >
            <option value="">Any Class</option>
            <option value="Ninja">Ninja</option>
            <option value="Warrior">Warrior</option>
            <option value="Guardian">Guardian</option>
            <option value="Brute">Brute</option>
            {/* Add more classes as needed */}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Card Type</label>
          <select 
            className="w-full p-2 border rounded"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="">Any Type</option>
            <option value="Attack">Attack</option>
            <option value="Defense">Defense</option>
            <option value="Hero">Hero</option>
            <option value="Equipment">Equipment</option>
            {/* Add more types as needed */}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(card => (
              <div key={card.unique_id} className="border rounded p-3 bg-gray-800">
                <h3 className="font-medium">{card.name}</h3>
                {card.pitch && (
                  <div className={`inline-block w-4 h-4 rounded-full mr-1 ${
                    card.pitch === 1 ? 'bg-red-600' : 
                    card.pitch === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                )}
                {card.types && (
                  <div className="text-sm text-gray-400">{card.types.join(', ')}</div>
                )}
                {card.card_text && (
                  <p className="text-sm mt-2">{card.card_text}</p>
                )}
              </div>
            ))}
          </div>
          
          {results.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button 
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button 
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardSearch;