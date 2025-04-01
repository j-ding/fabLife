// /client/src/components/cards/CardBrowser.js
import React, { useState, useEffect } from 'react';
import { useCardContext } from '../../context/cardContext';
import CardList from './CardList';
import CardDetail from './CardDetail';
import SearchFilters from './SearchFilters';

const CardBrowser = () => {
  const { searchForCards, loading, error } = useCardContext();
  const [searchParams, setSearchParams] = useState({
    query: '',
    hero_class: '',
    type: '',
    page: 1,
    limit: 20
  });
  const [results, setResults] = useState({
    cards: [],
    totalPages: 0,
    currentPage: 1
  });
  const [selectedCard, setSelectedCard] = useState(null);

  // Perform search when params change
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Only search if we have some filter criteria
        if (searchParams.query || searchParams.hero_class || searchParams.type) {
          const data = await searchForCards(searchParams);
          setResults(data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    fetchCards();
  }, [searchParams, searchForCards]);

  // Handle search form submission
  const handleSearch = (newParams) => {
    setSearchParams({
      ...searchParams,
      ...newParams,
      page: 1 // Reset to first page on new search
    });
    
    // Clear selected card when searching
    setSelectedCard(null);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setSearchParams({
      ...searchParams,
      page: newPage
    });
    
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  // Handle selecting a card to view details
  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

  // Handle closing card detail view
  const handleCloseDetail = () => {
    setSelectedCard(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Card Browser</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search and filters - takes 1/4 of the space on large screens */}
        <div className="lg:col-span-1">
          <SearchFilters 
            onSearch={handleSearch} 
            initialValues={{
              query: searchParams.query,
              hero_class: searchParams.hero_class,
              type: searchParams.type
            }}
          />
        </div>
        
        {/* Results area - takes 3/4 of the space on large screens */}
        <div className="lg:col-span-3">
          {selectedCard ? (
            <CardDetail 
              card={selectedCard} 
              onClose={handleCloseDetail} 
            />
          ) : (
            <>
              {loading && <div className="text-center p-4">Loading cards...</div>}
              
              {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
              
              {!loading && !error && results.cards.length === 0 && (
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                  <p className="text-lg mb-2">No cards found</p>
                  <p className="text-gray-400">Try adjusting your search filters</p>
                </div>
              )}
              
              {!loading && !error && results.cards.length > 0 && (
                <>
                  <div className="mb-4">
                    <p className="text-gray-400">
                      Showing {results.cards.length} cards 
                      (Page {results.currentPage} of {results.totalPages})
                    </p>
                  </div>
                  
                  <CardList 
                    cards={results.cards} 
                    onSelectCard={handleSelectCard}
                  />
                  
                  {/* Pagination */}
                  {results.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
                          disabled={results.currentPage === 1}
                          onClick={() => handlePageChange(results.currentPage - 1)}
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, results.totalPages) }, (_, i) => {
                            // Show pages around current page
                            const pageOffset = Math.min(
                              Math.max(0, results.currentPage - 3),
                              Math.max(0, results.totalPages - 5)
                            );
                            const page = i + 1 + pageOffset;
                            
                            return (
                              <button
                                key={page}
                                className={`w-10 h-10 rounded ${
                                  page === results.currentPage
                                    ? 'bg-red-800 font-bold'
                                    : 'bg-gray-800'
                                }`}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
                          disabled={results.currentPage === results.totalPages}
                          onClick={() => handlePageChange(results.currentPage + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBrowser;