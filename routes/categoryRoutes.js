const express = require('express');
const categoryController = require('./../controlles/categoryController');
const { checkAuthenticated } = require('./../config/auth');

const router = express.Router();

router.get('/category', checkAuthenticated, categoryController.getCategory);

module.exports = router;
