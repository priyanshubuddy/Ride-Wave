const Driver = require('../models/Driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerDriver = async (req, res) => {
    try {
        const { name, vehicleDetails, licenseNumber, email, password } = req.body;

        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ 
                status: 400,
                error: 'Driver with this email already exists' 
            });
        }

        if (!name || !vehicleDetails || !licenseNumber || !email || !password) {
            return res.status(400).json({ 
                status: 400,
                error: 'All fields are required' 
            });
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

        const token = jwt.sign({ driverId: driver._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Prepare driver data without sensitive information
        const userData = {
            id: driver._id,
            name: driver.name,
            email: driver.email,
            vehicleDetails: driver.vehicleDetails,
            licenseNumber: driver.licenseNumber,
            type: 'driver'
        };

        res.status(201).json({
            status: 201,
            message: 'Driver registered successfully',
            token,
            userData
        });
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({ 
            status: 500, 
            error: 'Error registering driver' 
        });
    }
};

exports.loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;
        const driver = await Driver.findOne({ email });
        
        if (!driver) {
            return res.status(401).json({ 
                status: 401,
                error: 'Invalid email or password' 
            });
        }

        const isPasswordValid = await bcrypt.hash(password, driver.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                status: 401,
                error: 'Invalid email or password' 
            });
        }

        const token = jwt.sign({ driverId: driver._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        // Prepare driver data without sensitive information
        const userData = {
            id: driver._id,
            name: driver.name,
            email: driver.email,
            vehicleDetails: driver.vehicleDetails,
            licenseNumber: driver.licenseNumber,
            type: 'driver'
        };

        res.status(200).json({ 
            status: 200,
            message: 'Login successful',
            token,
            userData
        });
    } catch (error) {
        console.error('Error logging in driver:', error);
        res.status(500).json({ 
            status: 500,
            error: 'Error logging in driver' 
        });
    }
};