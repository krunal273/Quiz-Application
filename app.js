const path = require('path');
// const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const bodyParse = require('body-parser');
const passport = require('passport');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// const expressMessages = require('express-messages');
const Category = require('./models/categoryModel');
const Testset = require('./models/TestsetModel');
const authRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
// const catchAsync = require('./utils/catchAsync');
const { checkAuthenticated, checkNotAuthenticated } = require('./config/auth');

const app = express();

// morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// passport configurartion
const initialize = require('./config/passport');

initialize(passport);

// view engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser, reading data from body into req.body
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(flash());

// global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// caching disabled for every route
// app.use(function(req, res, next) {
//   res.set(
//     'Cache-Control',
//     'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
//   );
//   next();
// });

// if (process.env.NODE_ENV === 'development') {
//   const category = JSON.parse(
//     fs.readFileSync(path.join(__dirname, 'data/category.json'), 'utf-8')
//   );
//   const testSet = JSON.parse(
//     fs.readFileSync(path.join(__dirname, 'data/testSet.json'), 'utf-8')
//   );

//   console.log(category);
//   console.log(testSet);

//   const importData = async () => {
//     try {
//       await Category.create(category);
//       await Testset.create(testSet);
//       console.log('Data is imported to database please check it');
//     } catch (err) {
//       console.log('err', err);
//     }
//   };
//   importData();
// }

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', viewRoutes);
app.use('/user', authRoutes);
app.use('/test', testRoutes);
app.use('/category', categoryRoutes);

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('startpage', { layout: 'startpage' });
});

app.get('/dashboard', checkAuthenticated, async (req, res, next) => {
  const categoryList = await Category.find({}, { title: 1 });
  const testList = await Testset.find(
    {},
    { testName: 1, category: 1, description: 1 }
  );

  res.render('dashboard/dashboard', {
    title: 'Dashboard',
    user: req.user,
    category: categoryList,
    testList: testList
  });
});

app.get('*', checkNotAuthenticated, (req, res) => {
  res.render('error-pages/404', { layout: 'error-pages/404' });
});

module.exports = app;
