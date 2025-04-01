import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LifeTracker from './components/game/LifeTracker';
import CardSearch from './components/cards/CardSearch';
import CardDetail from './components/cards/CardDetail';
import { CardProvider } from './context/CardContext';
import Settings from './components/settings/Settings';

function App() {
  return (
    <CardProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Routes>
            <Route path="/" element={<LifeTracker />} />
            <Route path="/cards" element={<CardSearch />} />
            <Route path="/cards/:id" element={<CardDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </CardProvider>
  );
}

export default App;