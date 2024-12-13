const RideRequest = require('../models/RideRequest');
const Driver = require('../models/Driver');
const { logger } = require('../config/logger');
const mongoose = require('mongoose');

// Test driver data with realistic details for each vehicle type
const testDrivers = [
  // Bike Drivers
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Rajesh Kumar',
    vehicleDetails: 'Honda Activa - KA 01 AB 1234',
    rating: 4.8,
    isAvailable: true,
    vehicleType: 'Bike',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Amit Singh',
    vehicleDetails: 'TVS Jupiter - KA 02 CD 5678',
    rating: 4.7,
    isAvailable: true,
    vehicleType: 'Bike',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg'
  },

  // Auto Drivers
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Mohammed Ismail',
    vehicleDetails: 'Bajaj Auto - KA 05 MN 9012',
    rating: 4.6,
    isAvailable: true,
    vehicleType: 'Auto',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Venkatesh R',
    vehicleDetails: 'Piaggio Auto - KA 03 XY 3456',
    rating: 4.9,
    isAvailable: true,
    vehicleType: 'Auto',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/56.jpg'
  },

  // Mini Drivers
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Suresh Patel',
    vehicleDetails: 'Maruti Swift - KA 01 PQ 7890',
    rating: 4.8,
    isAvailable: true,
    vehicleType: 'Mini',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/62.jpg'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Priya Sharma',
    vehicleDetails: 'Hyundai i10 - KA 04 EF 2345',
    rating: 4.9,
    isAvailable: true,
    vehicleType: 'Mini',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/women/42.jpg'
  },

  // Prime Sedan Drivers
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Rahul Verma',
    vehicleDetails: 'Honda City - KA 01 UV 6789',
    rating: 4.9,
    isAvailable: true,
    vehicleType: 'Prime Sedan',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Karthik Menon',
    vehicleDetails: 'Hyundai Verna - KA 02 GH 9012',
    rating: 4.8,
    isAvailable: true,
    vehicleType: 'Prime Sedan',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/82.jpg'
  },

  // Prime SUV Drivers
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Arun Nair',
    vehicleDetails: 'Toyota Innova - KA 01 WX 3456',
    rating: 4.9,
    isAvailable: true,
    vehicleType: 'Prime SUV',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/92.jpg'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Deepak Reddy',
    vehicleDetails: 'Mahindra XUV700 - KA 05 JK 7890',
    rating: 4.7,
    isAvailable: true,
    vehicleType: 'Prime SUV',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    profileImage: 'https://randomuser.me/api/portraits/men/95.jpg'
  }
];

exports.createRideRequest = async (req, res) => {
  try {
    const {
      origin,
      destination,
      vehicleType,
      fare,
      estimatedDistance,
      estimatedDuration
    } = req.body;

    // Create new ride request
    const rideRequest = new RideRequest({
      user: req.user._id,
      origin,
      destination,
      vehicleType,
      fare,
      estimatedDistance,
      estimatedDuration,
      status: 'PENDING'
    });

    await rideRequest.save();

    // Simulate finding a driver after 5 seconds
    setTimeout(async () => {
      try {
        const matchingDriver = testDrivers.find(d => d.vehicleType === vehicleType);
        if (matchingDriver) {
          const updatedRequest = await RideRequest.findById(rideRequest._id);
          if (updatedRequest) {
            updatedRequest.status = 'ACCEPTED';
            updatedRequest.driver = matchingDriver._id;
            await updatedRequest.save();
            logger.info(`Driver ${matchingDriver._id} assigned to ride request ${rideRequest._id}`);
          }
        }
      } catch (error) {
        logger.error('Error in driver assignment:', error);
      }
    }, 5000);

    res.status(201).json({
      status: 'success',
      message: 'Ride request created successfully',
      data: {
        rideRequest,
        availableDrivers: testDrivers.filter(d => d.vehicleType === vehicleType).length
      }
    });
  } catch (error) {
    logger.error('Error creating ride request:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getRideRequestStatus = async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);
    
    if (!rideRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Ride request not found'
      });
    }

    // If the status is ACCEPTED but no driver info (for testing)
    if (rideRequest.status === 'ACCEPTED') {
      // Find matching driver for this vehicle type
      const matchingDriver = testDrivers.find(d => d.vehicleType === rideRequest.vehicleType);
      
      if (matchingDriver) {
        // Add the test driver data to the response
        const responseData = {
          ...rideRequest.toObject(),
          driver: matchingDriver
        };
        
        return res.json({
          status: 'success',
          data: responseData
        });
      }
    }

    res.json({
      status: 'success',
      data: rideRequest
    });
  } catch (error) {
    logger.error('Error getting ride request status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.cancelRideRequest = async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Ride request not found'
      });
    }

    rideRequest.status = 'CANCELLED';
    await rideRequest.save();

    res.json({
      status: 'success',
      message: 'Ride request cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling ride request:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.completeRideRequest = async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Ride request not found'
      });
    }

    rideRequest.status = 'COMPLETED';
    rideRequest.actualDropoffTime = new Date();
    await rideRequest.save();

    res.json({
      status: 'success',
      message: 'Ride completed successfully',
      data: rideRequest
    });
  } catch (error) {
    logger.error('Error completing ride request:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getRideHistory = async (req, res) => {
  try {
    const rideHistory = await RideRequest.find({ 
      user: req.user._id,
      status: { $in: ['COMPLETED', 'CANCELLED'] }
    })
    .sort({ requestedAt: -1 }) // Sort by most recent first
    .limit(50); // Limit to last 50 rides

    // Add driver information to each ride
    const ridesWithDrivers = rideHistory.map(ride => {
      const rideObj = ride.toObject();
      if (rideObj.status === 'COMPLETED') {
        // Find matching test driver
        const driver = testDrivers.find(d => d.vehicleType === rideObj.vehicleType);
        if (driver) {
          rideObj.driver = driver;
        }
      }
      return rideObj;
    });

    res.json({
      status: 'success',
      data: {
        rides: ridesWithDrivers
      }
    });
  } catch (error) {
    logger.error('Error fetching ride history:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};