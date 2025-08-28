const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const recruiterController = require('../controllers/recruiterController');
const { uploadRecruiterPic } = require('../middleware/uploadMiddleware');

router.get('/me', protect, recruiterController.getProfile);
router.put('/update', protect, recruiterController.updateProfile);
router.put('/change-password', protect, recruiterController.changePassword);

router.put(
  '/profile-pic',
  protect,
  uploadRecruiterPic.single('profilePic'),
  recruiterController.updateProfilePic
);

module.exports = router;
