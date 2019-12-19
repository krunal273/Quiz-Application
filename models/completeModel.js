const mongoose = require('mongoose');

const completeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Complete test must have User ID']
  },
  testSet: {
    type: mongoose.Schema.ObjectId,
    ref: 'Testset',
    required: [true, 'Complete test must have Test set']
  },
  score: {
    type: Number,
    required: [true, 'Complete test must have Score']
  },
  completedDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Complete = mongoose.model('Complete', completeSchema);

module.exports = Complete;
