const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
  try {
    console.log('DEBUG file keys:', req.files ? Object.keys(req.files) : null);
    console.log('DEBUG body:', req.body);

    const resumeObj =
      (req.files?.resume && req.files.resume[0]) ||
      (req.files?.resumeFile && req.files.resumeFile[0]);

    if (!resumeObj) {
      return res.status(400).json({ message: 'Resume PDF required (field: resume)' });
    }

    const imageObj =
      (req.files?.profileImage && req.files.profileImage[0]) ||
      (req.files?.profile_image && req.files.profile_image[0]) ||
      (req.files?.image && req.files.image[0]);

    const application = await Application.create({
      candidateName: req.body.candidateName,
      role: req.body.role,
      experience: req.body.experience,
      skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : [],
      resumeFile: resumeObj.path || resumeObj.url,       
      profileImage: imageObj ? imageObj.path || imageObj.url : null, 
      recruiter: req.user._id,                         
    });

    res.status(201).json(application);
  } catch (err) {
    console.error('createApplication error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, recruiter: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.updateStatus = async (req, res) => {
  try {
    const allowed = ['Applied', 'Interview', 'Offer', 'Rejected'];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const app = await Application.findById(req.params.id); // ✅ only _id
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = req.body.status;
    await app.save();

    res.json({ message: 'Status updated', application: app });
  } catch (err) {
    console.error("updateStatus error:", err); // 👀 log actual error
    res.status(500).json({ message: err.message });
  }
};



exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
