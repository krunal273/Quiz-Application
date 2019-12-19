const Category = require('./../models/categoryModel');
const Testset = require('./../models/TestsetModel');
const catchAsync = require('./../utils/catchAsync');

exports.getCategory = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const testList = await Testset.find(
    { category: name },
    { testName: 1, category: 1, description: 1 }
  );
  if (testList.length !== 0) {
    const categoryList = await Category.find({}, { title: 1 });
    res.render('dashboard/dashboard', {
      title: 'Dashboard',
      user: req.user,
      category: categoryList,
      testList: testList
    });
  } else {
    res.redirect('/dashboard');
  }
});
