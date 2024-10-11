const express = require('express');
const driverController = require('../controllers/driverController');

const router = express.Router();

router.post('/register', driverController.registerDriver);

module.exports = router;