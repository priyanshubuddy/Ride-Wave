const express = require('express');
const rideController = require('../controllers/rideController');

const router = express.Router();

router.post('/create', rideController.createRide);
router.get('/', rideController.getRides);

module.exports = router;
