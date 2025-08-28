const Recruiter = require('../models/Recruiter');
const generateToken = require('../utils/generateToken');

const signup = async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email & password are required.' });
    }

    const exists = await Recruiter.findOne({ email: (email || '').toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered.' });

    const recruiter = await Recruiter.create({
      name,
      email: (email || '').toLowerCase(),
      password,
      company,
      role,
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
        role: recruiter.role,
        profilePic: recruiter.profilePic || null,
      },
      token: generateToken(recruiter._id),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Recruiter.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        profilePic: user.profilePic || null,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const me = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { signup, login, me }; 
