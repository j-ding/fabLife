import React, { useState, useContext } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { CardContext } from '../../context/cardContext';

const Settings = () => {
  const { gameFormat, updateGameFormat } = useContext(CardContext);
  
  const [settings, setSettings] = useState({
    defaultFormat: gameFormat,
    darkMode: true,
    autoLogMatches: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update game format in context
    updateGameFormat(settings.defaultFormat);
    
    // Save other settings to localStorage
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Show success message or redirect
    alert('Settings saved!');
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button 
          className="mr-4"
          onClick={() => window.location.href = '/'}
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Default Game Format</label>
          <select
            name="defaultFormat"
            value={settings.defaultFormat}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
          >
            <option value="blitz">Blitz</option>
            <option value="cc">CC (Constructed Classic)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="mr-2"
            />
            Dark Mode
          </label>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="autoLogMatches"
              checked={settings.autoLogMatches}
              onChange={handleChange}
              className="mr-2"
            />
            Automatically Save Match History
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full p-2 bg-red-800 rounded flex items-center justify-center"
        >
          <Save className="mr-2" size={18} />
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;