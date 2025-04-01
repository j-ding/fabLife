import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CardProvider } from './context/cardContext';
import LifeTracker from './components/game/LifeTracker';
import Settings from './components/settings/Settings';

function App() {
  return (
    <CardProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Routes>
            <Route path="/" element={<LifeTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </CardProvider>
  );
}

export default App;