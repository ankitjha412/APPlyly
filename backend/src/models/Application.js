const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: Number, required: true },
  skills: [{ type: String }], 
  resumeFile: { type: String, required: true }, 
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
