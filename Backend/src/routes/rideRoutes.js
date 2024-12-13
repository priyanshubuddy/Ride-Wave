const express = require('express');
const rideController = require('../controllers/rideController');
const rideRequestController = require('../controllers/rideRequestController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Protect all routes with authentication
router.use(authenticateToken);

// Ride request routes
router.get('/ride-requests/history', rideRequestController.getRideHistory);
router.post('/ride-requests', rideRequestController.createRideRequest);
router.get('/ride-requests/:id', rideRequestController.getRideRequestStatus);
router.post('/ride-requests/:id/cancel', rideRequestController.cancelRideRequest);
router.post('/ride-requests/:id/complete', rideRequestController.completeRideRequest);

// Regular ride routes
router.post('/create', rideController.createRide);
router.get('/', rideController.getRides);

module.exports = router;
