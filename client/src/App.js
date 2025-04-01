// Update App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LifeTracker from './components/game/LifeTracker';
import CardBrowser from './components/cards/CardBrowser';
import Settings from './components/settings/Settings';
import { CardProvider } from './context/cardContext';

function App() {
  return (
    <CardProvider>
      <Router>
        <div className="bg-gray-900 text-white min-h-screen">
          <Routes>
            <Route path="/" element={<LifeTracker />} />
            <Route path="/cards" element={<CardBrowser />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </CardProvider>
  );
}

export default App;