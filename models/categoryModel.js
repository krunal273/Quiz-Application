const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide question Title'],
    unique: true,
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Please provide options'],
    trim: true
  },
  answer: {
    type: [Number],
    required: [true, 'provide your answer']
  },
  questionType: {
    type: String,
    required: [true, 'question must have type'],
    enum: {
      values: ['single', 'multiple', 'text', 'order', 'join'],
      message:
        'question type is either: single, multiple, text, ordering, or joining'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'A question must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  time: {
    type: Number,
    required: [true, 'provide time in seconds'],
    default: 30
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    required: [true, 'provide points to question'],
    default: 1,
    min: [1, 'points must be 1 or above'],
    max: [5, 'points must be 5 or below']
  }
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please provide title of category'],
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },
  questions: {
    type: [questionSchema],
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
