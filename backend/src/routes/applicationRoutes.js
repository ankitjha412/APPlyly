const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadApplication } = require('../middleware/uploadMiddleware');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateStatus,
  deleteApplication
} = require('../controllers/applicationController');

const fileFields = [
  { name: 'resume', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 },     
  { name: 'profileImage', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 },  
  { name: 'image', maxCount: 1 }           
];

router.post('/', protect, uploadApplication.fields(fileFields), createApplication);

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;


