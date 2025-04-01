const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get user settings
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.settings = {
      ...user.settings,
      ...req.body
    };
    
    await user.save();
    
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { email, username, profilePicture } = req.body;
    
    // Check if email or username already exists
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    if (username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          email: email || undefined,
          username: username || undefined,
          profilePicture: profilePicture || undefined
        } 
      },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};