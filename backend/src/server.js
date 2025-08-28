const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: "http://localhost:5173",   
  credentials: true                  
}));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
      field: err.field || null,
      code: err.code || null,
    });
  }
  next(err);
});
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recruiter', require('./routes/recruiterRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
