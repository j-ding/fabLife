// /client/src/components/cards/CardList.js
import React from 'react';

const CardList = ({ cards, onSelectCard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(card => (
        <div 
          key={card.unique_id} 
          className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => onSelectCard(card)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{card.name}</h3>
            
            {card.pitch !== null && (
              <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                card.pitch === 1 ? 'bg-red-600' : 
                card.pitch === 2 ? 'bg-yellow-500' : 
                card.pitch === 3 ? 'bg-blue-500' : ''
              }`} />
            )}
          </div>
          
          {card.types && (
            <div className="text-sm text-gray-400 mt-1">
              {card.types.join(', ')}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            {card.cost !== null && (
              <div className="text-sm">
                <span className="text-gray-400">Cost:</span> {card.cost}
              </div>
            )}
            
            {card.power !== null && (
              <div className="text-sm">
                <span className="text-gray-400">Power:</span> {card.power}
              </div>
            )}
            
            {card.defense !== null && (
              <div className="text-sm">
                <span className="text-gray-400">Defense:</span> {card.defense}
              </div>
            )}
          </div>
          
          {card.card_functional_text && (
            <div className="mt-2 text-sm text-gray-300 line-clamp-3">
              {card.card_functional_text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardList;