const { check, validationResult } = require('express-validator');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.validationRegister = () => {
  return [
    check('firstname')
      .notEmpty()
      .withMessage('Please provide your firstname')
      .isAlpha()
      .withMessage('firstname only contains letters')
      .trim(),
    check('lastname')
      .notEmpty()
      .withMessage('Please provide your lastname')
      .isAlpha()
      .withMessage('lastname only contains letters')
      .trim(),
    check('email')
      .notEmpty()
      .withMessage('Please provide your Email')
      .isEmail()
      .withMessage('Provided Email is not valid')
      .normalizeEmail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            throw new Error('E-mail already in use');
          }
        });
      }),
    check('password')
      .notEmpty()
      .withMessage('Please enter password')
      .isLength({ min: 3 })
      .withMessage('password must be at least 8 chars long'),
    check('confirmPassword')
      .notEmpty()
      .withMessage('Please Enter confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      })
  ];
};

exports.register = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors.array());

  if (!errors.isEmpty()) {
    res.render('authviews/register', {
      layout: 'authviews/authlayout',
      errors: errors.array(),
      cssClass: 'alert-validate'
    });
  } else {
    await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.confirmPassword
    });

    req.flash('success_msg', 'You are registred and can login.');
    res.redirect('login');
  }
});

exports.validationLogin = () => {
  return [
    check('email')
      .notEmpty()
      .withMessage('Please provide your Email')
      .isEmail()
      .withMessage('Provided Email is not valid'),
    check('password')
      .notEmpty()
      .withMessage('Please enter your password')
  ];
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  //   console.log(errors.array());

  if (!errors.isEmpty()) {
    res.render('authviews/login', {
      layout: 'authviews/authlayout',
      errors: errors.array(),
      cssClass: 'alert-validate'
    });
  } else {
    next();
  }
};

exports.validationForgetPassword = () => {
  return [
    check('email')
      .notEmpty()
      .withMessage('Please provide your Email')
      .isEmail()
      .withMessage('Provided Email is not valid')
      .normalizeEmail()
      .custom(value => {
        return User.findOne({ email: value }).then(user => {
          if (!user) {
            throw new Error('E-mail is not registerd');
          }
        });
      }),
    check('password')
      .notEmpty()
      .withMessage('Please enter password')
      .isLength({ min: 3 })
      .withMessage('password must be at least 8 chars long'),
    check('confirmPassword')
      .notEmpty()
      .withMessage('Please Enter confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      })
  ];
};

exports.forgetpassword = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  //   console.log(errors.array());

  if (!errors.isEmpty()) {
    res.render('authviews/forgetpassword', {
      layout: 'authviews/authlayout',
      errors: errors.array(),
      cssClass: 'alert-validate'
    });
  } else {
    const user = await User.findOne({ email: req.body.email });

    user.password = req.body.password;
    user.passwordConfirm = req.body.confirmPassword;

    await user.save();

    // req.logout();
    req.flash('success_msg', 'Password Changed You can login again');
    res.redirect('login');
  }
});
