const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const applicationStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype === 'application/pdf') {
      return { folder: 'mini-ats/resumes', resource_type: 'raw' };
    }
    if (file.mimetype.startsWith('image/')) {
      return { folder: 'mini-ats/application-images', resource_type: 'image', allowed_formats: ['jpg','jpeg','png'] };
    }
    throw new Error('Unsupported file type');
  },
});

// only used in routes via .fields([...])
const uploadApplication = multer({
  storage: applicationStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const recruiterPicStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'mini-ats/recruiter-profiles', resource_type: 'image', allowed_formats: ['jpg','jpeg','png'] },
});

const uploadRecruiterPic = multer({
  storage: recruiterPicStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadApplication, uploadRecruiterPic };
