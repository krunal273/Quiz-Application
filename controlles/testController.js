const Category = require('./../models/categoryModel');
const Testset = require('./../models/TestsetModel');
const Complete = require('./../models/completeModel');
const catchAsync = require('./../utils/catchAsync');

exports.startTest = catchAsync(async (req, res, next) => {
  const { getTest, testId } = req.query;
  if (getTest) {
    const test = await Testset.findById({ _id: testId });
    const questionsList = [];
    test.questions.forEach(async element => {
      const question = await Category.aggregate([
        { $project: { matched: { $arrayElemAt: ['$questions', element] } } }
      ]);
      questionsList.push(question[0].matched);
    });

    setTimeout(() => {
      // SEND RESPONSE
      res.status(200).send({
        status: 'success',
        test: test,
        questions: questionsList
      });
    }, 3000);
  }
});

exports.complete = catchAsync(async (req, res, next) => {
  const { completeTest, testId, score } = req.body;
  if (completeTest) {
    await Complete.create({
      user: req.user._id,
      testSet: testId,
      score: score
    });

    res.status(201).send({
      status: 'success'
    });
  }
});

exports.getTestById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const completedTest = await Complete.findOne({
    user: req.user._id,
    testSet: id
  });

  if (!completedTest) {
    const test = await Testset.findOne({ _id: id });
    res.render('dashboard/test', {
      test: test
    });
  } else {
    req.flash('error_msg', 'Test is already Completed.');
    res.redirect('/dashboard');
  }
});
