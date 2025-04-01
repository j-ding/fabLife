const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  settings: {
    darkMode: {
      type: Boolean,
      default: true
    },
    notifications: {
      matchResults: {
        type: Boolean,
        default: true
      },
      appUpdates: {
        type: Boolean,
        default: true
      },
      tournamentReminders: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      shareMatchHistory: {
        type: Boolean,
        default: false
      },
      publicProfile: {
        type: Boolean,
        default: true
      }
    },
    defaultFormat: {
      type: String,
      enum: ['blitz', 'cc'],
      default: 'blitz'
    },
    defaultLifeDisplay: {
      type: String,
      enum: ['numbers', 'dial'],
      default: 'numbers'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', mongoose.connection.useDb('fabapp').collection('users'));