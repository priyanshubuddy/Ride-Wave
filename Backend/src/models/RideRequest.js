const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: {
    description: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    description: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  vehicleType: { type: String, required: true },
  fare: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING'
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  requestedAt: { type: Date, default: Date.now },
  estimatedDistance: Number,
  estimatedDuration: Number,
  actualPickupTime: Date,
  actualDropoffTime: Date,
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    default: 'PENDING'
  },
  paymentMethod: String
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);