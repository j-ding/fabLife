import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCardById } from '../../services/CardService';

const CardDetail = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const data = await getCardById(id);
        setCard(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading card details...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!card) return <div className="p-4 text-center">Card not found</div>;

  return (
    <div className="p-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{card.name}</h1>
            
            {card.pitch && (
              <div className="flex items-center mt-1">
                <span className="mr-2">Pitch:</span>
                <div className={`w-6 h-6 rounded-full ${
                  card.pitch === 1 ? 'bg-red-600' : 
                  card.pitch === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <span className="ml-1">{card.pitch}</span>
              </div>
            )}
          </div>
          
          {card.cost !== null && (
            <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="font-bold">{card.cost}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            {card.types && card.types.length > 0 && (
              <div className="mb-2">
                <span className="text-gray-400">Type:</span> {card.types.join(', ')}
              </div>
            )}
            
            {card.card_classes && card.card_classes.length > 0 && (
              <div className="mb-2">
                <span className="text-gray-400">Class:</span> {card.card_classes.join(', ')}
              </div>
            )}
            
            {card.power !== null && (
              <div className="mb-2">
                <span className="text-gray-400">Power:</span> {card.power}
              </div>
            )}
            
            {card.defense !== null && (
              <div className="mb-2">
                <span className="text-gray-400">Defense:</span> {card.defense}
              </div>
            )}
          </div>
          
          <div>
            {card.card_keywords && card.card_keywords.length > 0 && (
              <div className="mb-2">
                <span className="text-gray-400">Keywords:</span> {card.card_keywords.join(', ')}
              </div>
            )}
            
            {card.card_abilities && card.card_abilities.length > 0 && (
              <div className="mb-2">
                <span className="text-gray-400">Abilities:</span> {card.card_abilities.join(', ')}
              </div>
            )}
            
            {card.rarity && (
              <div className="mb-2">
                <span className="text-gray-400">Rarity:</span> {card.rarity}
              </div>
            )}
          </div>
        </div>
        
        {card.card_functional_text && (
          <div className="mt-4 p-3 bg-gray-700 rounded">
            <div className="text-gray-400 mb-1">Card Text:</div>
            <div>{card.card_functional_text}</div>
          </div>
        )}
        
        {card.flavor_text && (
          <div className="mt-4 p-3 bg-gray-700 rounded italic">
            {card.flavor_text}
          </div>
        )}
        
        {card.printings && card.printings.length > 0 && (
          <div className="mt-4">
            <div className="text-gray-400 mb-2">Printings:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {card.printings.map((printing, index) => (
                <div key={index} className="p-2 bg-gray-700 rounded text-sm">
                  <div>{printing.set_id} #{printing.collector_number}</div>
                  <div>Rarity: {printing.rarity}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail;