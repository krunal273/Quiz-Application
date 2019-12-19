const Category = require('./../models/categoryModel');
const Testset = require('./../models/TestsetModel');
const Complete = require('./../models/completeModel');

const catchAsync = require('./../utils/catchAsync');

exports.finishTest = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const completeTest = await Complete.find(
    { user: id },
    { testSet: 1, score: 1, completedDate: 1 }
  );
  const categoryList = await Category.find({}, { title: 1 });

  const testList = [];

  completeTest.forEach(async element => {
    const _id = element.testSet;
    const test = await Testset.findById({ _id }, { category: 0, questions: 0 });
    test.score = element.score;
    test.completedDate = element.completedDate;
    testList.push(test);
  });

  setTimeout(() => {
    // console.log(testList);
    res.render('dashboard/dashboard', {
      title: 'Dashboard',
      user: req.user,
      category: categoryList,
      testList: [],
      completeTestList: testList
    });
  }, 3000);
});
