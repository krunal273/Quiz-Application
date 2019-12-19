const mongoose = require('mongoose');
// const validator = require('validator');

// question, options {no,options},answer,type,difficulty,languages,time,createdDate,

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
    type: [String],
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
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Category for question is required']
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

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
