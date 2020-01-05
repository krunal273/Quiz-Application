const express = require('express');
const passport = require('passport');
const authController = require('../controlles/authController');
const userController = require('../controlles/userController');
const {
  checkAuthenticated,
  checkNotAuthenticated
} = require('./../config/auth');

const router = express.Router();

// login
router.get('/login', checkNotAuthenticated, (req, res) =>
  res.render('authviews/login', {
    layout: 'authviews/authlayout',
    cssClass: ''
  })
);

router.post(
  '/login',
  authController.validationLogin(),
  authController.login,
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })
);

// register
router.get('/register', checkNotAuthenticated, (req, res) =>
  res.render('authviews/register', {
    layout: 'authviews/authlayout',
    cssClass: ''
  })
);
router.post(
  '/register',
  authController.validationRegister(),
  authController.register
);

// forgetpassword
router.get('/forgetpassword', checkNotAuthenticated, (req, res) =>
  res.render('authviews/forgetpassword', {
    layout: 'authviews/authlayout',
    cssClass: ''
  })
);

router.post(
  '/forgetpassword',
  authController.validationForgetPassword(),
  authController.forgetpassword
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});

router.get('/finishtest', checkAuthenticated, userController.finishTest);

module.exports = router;
