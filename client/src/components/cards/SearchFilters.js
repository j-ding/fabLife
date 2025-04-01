// /client/src/components/cards/SearchFilters.js
import React, { useState } from 'react';

const SearchFilters = ({ onSearch, initialValues = {} }) => {
  const [query, setQuery] = useState(initialValues.query || '');
  const [heroClass, setHeroClass] = useState(initialValues.hero_class || '');
  const [cardType, setCardType] = useState(initialValues.type || '');
  
  // Common hero classes in FaB
  const heroClasses = [
    'Guardian',
    'Warrior',
    'Ninja',
    'Brute',
    'Runeblade',
    'Wizard',
    'Illusionist',
    'Ranger',
    'Mechanologist',
    'Merchant',
    'Assassin',
    'Generic'
  ];
  
  // Common card types in FaB
  const cardTypes = [
    'Hero',
    'Young Hero',
    'Weapon',
    'Equipment',
    'Attack',
    'Defense',
    'Attack Reaction',
    'Defense Reaction',
    'Instant',
    'Action',
    'Aura',
    'Item',
    'Token',
    'Mentor',
    'Resource'
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query,
      hero_class: heroClass,
      type: cardType
    });
  };
  
  const handleReset = () => {
    setQuery('');
    setHeroClass('');
    setCardType('');
    onSearch({
      query: '',
      hero_class: '',
      type: ''
    });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Card Name
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            placeholder="Search card name or text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Hero Class
          </label>
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            value={heroClass}
            onChange={(e) => setHeroClass(e.target.value)}
          >
            <option value="">Any Class</option>
            {heroClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Card Type
          </label>
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option value="">Any Type</option>
            {cardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-red-800 rounded flex-1"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;