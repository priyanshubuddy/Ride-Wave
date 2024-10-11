const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists', status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: lowerCaseEmail, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', status: 201 });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', status: 500 });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) return res.status(404).json({ error: 'User not found', status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials', status: 400 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, status: 200 });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user', status: 500 });
  }
};
