const Driver = require('../models/Driver');

exports.registerDriver = async (req, res) => {
    try {
        const { name, vehicleDetails, licenseNumber } = req.body;
        const driver = new Driver({ name, vehicleDetails, licenseNumber });
        await driver.save();
        res.status(201).json({ message: 'Driver registered successfully', driver });
    } catch (error) {
        res.status(500).json({ error: 'Error registering driver' });
    }
};