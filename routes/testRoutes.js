const express = require('express');
const testController = require('./../controlles/testController');
const { checkAuthenticated } = require('./../config/auth');

const router = express.Router();

// fetch all data(testSet and question) when test is start
router.get('/startTest', checkAuthenticated, testController.startTest);

// send data to server when test is completed
router.post('/complete', checkAuthenticated, testController.complete);

// get test by id
router.get('/:id', checkAuthenticated, testController.getTestById);

module.exports = router;
