const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    profileImage: { type: String },
    rideHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }]
});

module.exports = mongoose.model('User', userSchema);