const Ride = require('../models/Ride');

exports.createRide = async (req, res) => {
  try {
    const { user, driver, pickupLocation, dropoffLocation, fare } = req.body;
    const ride = new Ride({ user, driver, pickupLocation, dropoffLocation, fare });
    await ride.save();
    res.status(201).json({ message: 'Ride created successfully', ride });
  } catch (error) {
    res.status(500).json({ error: 'Error creating ride' });
  }
};

exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate('user driver');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rides' });
  }
};
