const Driver = require('../models/Driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerDriver = async (req, res) => {
    try {
        const { name, vehicleDetails, licenseNumber, email, password } = req.body;

        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ error: 'Driver with this email already exists' });
        }

        if (!name || !vehicleDetails || !licenseNumber || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const driver = new Driver({
            name,
            vehicleDetails,
            licenseNumber,
            email,
            password: hashedPassword
        });

        await driver.save();

        const token = jwt.sign({ driverId: driver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            status: 201,
            message: 'Driver registered successfully',
            driver: {
                id: driver._id,
                name: driver.name,
                email: driver.email
            },
            token
        });
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({ status: 500, error: 'Error registering driver' });
    }
};

exports.loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;
        const driver = await Driver.findOne({ email });
        
        if (!driver) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, driver.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ driverId: driver._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Login successful', token, driver: { id: driver._id, name: driver.name, email: driver.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in driver' });
    }
};