const Recruiter = require('../models/Recruiter');
const bcrypt = require('bcryptjs');

// @desc    Get recruiter profile
// @route   GET /api/recruiter/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    res.json(req.user); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update recruiter profile (name, company, role)
// @route   PUT /api/recruiter/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, company, role } = req.body;

    const recruiter = await Recruiter.findById(req.user._id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    recruiter.name = name || recruiter.name;
    recruiter.company = company || recruiter.company;
    recruiter.role = role || recruiter.role;

    const updated = await recruiter.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      company: updated.company,
      role: updated.role,
      profilePic: updated.profilePic || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Change password
// @route   PUT /api/recruiter/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new password are required' });
    }

    const recruiter = await Recruiter.findById(req.user._id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    const isMatch = await bcrypt.compare(oldPassword, recruiter.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    recruiter.password = newPassword; 
    await recruiter.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update recruiter profile picture
// @route   PUT /api/recruiter/profile-pic
// @access  Private
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const recruiter = await Recruiter.findById(req.user._id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

    recruiter.profilePic = req.file.path; 
    await recruiter.save();

    res.json({
      message: 'Profile picture updated',
      profilePic: recruiter.profilePic,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
