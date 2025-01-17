const fs = require('fs');
const Career = require('../model/career');  

const submitApplication = async (req, res) => {
  try {
    const { name, address, email, contactNo, postAppliedFor } = req.body;
    
    // Validate inputs
    if (!name || !address || !email || !contactNo || !postAppliedFor) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(contactNo)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Check if resume file exists in the request
    if (!req.files || !req.files.resumeFile || !req.files.resumeFile[0]) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // Get just the filename instead of the full path
    const resumePath = req.files.resumeFile[0].filename;

    // Create new application
    const application = new Career({
      name,
      address,
      email,
      contactNo,
      postAppliedFor,
      resumeFile: resumePath
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error in submitApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { name, address, email, contactNo, postAppliedFor } = req.body;
    
    // Find existing application
    const application = await Career.findById(req.query.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update fields if provided
    if (name) application.name = name;
    if (address) application.address = address;
    if (email) {
      // Validate email if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      application.email = email;
    }
    if (contactNo) {
      // Validate phone if provided
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(contactNo)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
      application.contactNo = contactNo;
    }
    if (postAppliedFor) application.postAppliedFor = postAppliedFor;

    // Handle resume file update if provided
    if (req.files && req.files.resumeFile && req.files.resumeFile[0]) {
      // Delete old resume file
      if (application.resumeFile) {
        try {
          fs.unlinkSync(application.resumeFile);
        } catch (err) {
          console.error('Error deleting old resume:', err);
        }
      }
      // Update with new resume file
      application.resumeFile = req.files.resumeFile[0].path;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Career.findById(req.query.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Delete resume file from storage
    if (application.resumeFile) {
      try {
        fs.unlinkSync(application.resumeFile);
      } catch (err) {
        console.error('Error deleting resume file:', err);
      }
    }

    await Career.findByIdAndDelete(req.query.id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};
