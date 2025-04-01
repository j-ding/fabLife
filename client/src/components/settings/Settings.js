import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Bell, Shield, Moon, X } from 'lucide-react';

const Settings = () => {
  // User settings state
  const [settings, setSettings] = useState({
    email: '',
    username: '',
    profilePicture: null,
    darkMode: true,
    notifications: {
      matchResults: true,
      appUpdates: true,
      tournamentReminders: false
    },
    privacy: {
      shareMatchHistory: false,
      publicProfile: true
    },
    defaultFormat: 'blitz',
    defaultLifeDisplay: 'numbers' // 'numbers' or 'dial'
  });

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...settings});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load user settings
  useEffect(() => {
    // In a real app, you would fetch from API
    // This simulates loading saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      setFormData(JSON.parse(savedSettings));
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [section, key] = name.split('.');
        setFormData({
          ...formData,
          [section]: {
            ...formData[section],
            [key]: checked
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send to API
    setSettings(formData);
    localStorage.setItem('userSettings', JSON.stringify(formData));
    
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    setIsEditing(false);
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {successMessage && (
        <div className="bg-green-800 text-white p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-800 text-white p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Account Settings */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <User className="mr-2" />
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Profile Picture</label>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden mr-4">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={32} />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="text-sm"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <div className="flex items-center">
              <Mail className="mr-2 text-gray-400" size={18} />
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </div>
        
        {/* App Preferences */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <Moon className="mr-2" />
            <h2 className="text-xl font-semibold">App Preferences</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Dark Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Default Game Format</label>
            <select
              name="defaultFormat"
              value={formData.defaultFormat}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            >
              <option value="blitz">Blitz</option>
              <option value="cc">CC (Constructed Classic)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Life Display</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="defaultLifeDisplay"
                  value="numbers"
                  checked={formData.defaultLifeDisplay === 'numbers'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Numbers
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="defaultLifeDisplay"
                  value="dial"
                  checked={formData.defaultLifeDisplay === 'dial'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Dial
              </label>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <Bell className="mr-2" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label>Match Results</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="notifications.matchResults"
                  checked={formData.notifications.matchResults}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <label>App Updates</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="notifications.appUpdates"
                  checked={formData.notifications.appUpdates}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <label>Tournament Reminders</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="notifications.tournamentReminders"
                  checked={formData.notifications.tournamentReminders}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Privacy */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="mr-2" />
            <h2 className="text-xl font-semibold">Privacy</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label>Share Match History</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="privacy.shareMatchHistory"
                  checked={formData.privacy.shareMatchHistory}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <label>Public Profile</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="privacy.publicProfile"
                  checked={formData.privacy.publicProfile}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={() => {
              setFormData({...settings});
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-red-800 rounded flex items-center"
          >
            <Save className="mr-2" size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;