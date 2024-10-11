const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleDetails: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  rating: { type: Number, default: 0 },
  availabilityStatus: { type: Boolean, default: true }
});

module.exports = mongoose.model('Driver', driverSchema);
