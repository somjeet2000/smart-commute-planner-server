const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Connects with the user model
    ref: 'User',
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  timeToLeaveOrigin: {
    type: String,
    required: true,
  },
  timeToLeaveDestination: {
    type: String,
    required: true,
  },
  tripCreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', tripSchema);
