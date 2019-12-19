const mongoose = require('mongoose');
const Category = require('./categoryModel');
const AppError = require('./../utils/appError');

const testSetSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: [true, 'please provide test name']
  },
  description: {
    type: String,
    required: [true, 'provide description for test']
  },
  category: {
    type: String,
    required: [true, 'please provide title of category']
  },
  questions: {
    type: [Number],
    required: [true, 'Provide Question list']
  },
  totalScore: {
    type: Number,
    default: 0
  }
});

testSetSchema.pre('save', async function(next) {
  // const title = this.category;
  // const questionList = this.questions;
  const { category, questions } = this;
  const categoryObj = await Category.findOne({ title: category });

  if (categoryObj) {
    this.totalScore = categoryObj.questions
      .filter(function(currElement, index) {
        return questions.includes(index);
      })
      .reduce(function(score, question) {
        return score + question.points;
      }, 0);
  } else {
    next(new AppError('Category is not exist'));
  }

  next();
});

const Testset = mongoose.model('Testset', testSetSchema);

module.exports = Testset;
