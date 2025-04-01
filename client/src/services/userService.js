import axios from 'axios';

const API_URL = '/api';

// Get auth token from local storage
const getToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

// Set auth token in headers
const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get user settings
export const getUserSettings = async () => {
  try {
    setAuthHeader();
    const response = await axios.get(`${API_URL}/user/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

// Update user settings
export const updateUserSettings = async (settings) => {
  try {
    setAuthHeader();
    const response = await axios.put(`${API_URL}/user/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    setAuthHeader();
    const response = await axios.put(`${API_URL}/user/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    setAuthHeader();
    const response = await axios.put(`${API_URL}/user/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};