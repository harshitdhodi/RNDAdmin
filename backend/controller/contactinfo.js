const User = require('../model/contactinfo');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { address, mobiles, emails, mapLink, hrEmail, hrPhone, imgTitle, altName } = req.body;

    console.log('📥 CREATE REQUEST BODY:', req.body);
    console.log('📥 FILES:', req.files);

    // Extract photo file names from middleware
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => file.filename);
    }

    // Handle array conversion for mobiles and emails
    const mobileArray = Array.isArray(mobiles) ? mobiles : mobiles ? [mobiles] : [];
    const emailArray = Array.isArray(emails) ? emails : emails ? [emails] : [];
    const imgTitleArray = Array.isArray(imgTitle) ? imgTitle : imgTitle ? [imgTitle] : [];
    const altNameArray = Array.isArray(altName) ? altName : altName ? [altName] : [];

    console.log('✅ Processed Data:', {
      address,
      photos,
      mobileArray,
      emailArray,
      imgTitleArray,
      altNameArray,
      mapLink,
      hrEmail,
      hrPhone
    });

    const newUser = new User({
      photo: photos,
      address,
      mobiles: mobileArray,
      emails: emailArray,
      mapLink,
      imgTitle: imgTitleArray,
      altName: altNameArray,
      hrEmail,
      hrPhone
    });

    await newUser.save();
    console.log('✅ User created successfully:', newUser);
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('❌ Create Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log('📋 All users fetched:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Get users error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('📋 User fetched by ID:', user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const path = require('path');
const fs = require('fs');

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { address, mobiles, emails, mapLink, hrEmail, hrPhone, imgTitle, altName } = req.body;

    console.log('📥 UPDATE REQUEST ID:', id);
    console.log('📥 UPDATE BODY:', req.body);
    console.log('📥 FILES:', req.files);
    console.log('📝 Existing User:', req.body);

    // Validate ID presence
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('👤 Current user in DB:', user);

    // Prepare updated data — ONLY update fields that are explicitly provided and not empty
    const updatedData = {};

    // Handle photo files - if new files uploaded, update them. Otherwise keep existing
    if (req.files && req.files.length > 0) {
      updatedData.photo = req.files.map(file => file.filename);
      console.log('📸 New photos uploaded:', updatedData.photo);
    } else {
      console.log('📸 No new photos - keeping existing:', user.photo);
      // Don't clear photos if not updating
    }

    // Handle text fields - only update if provided and not empty
    if (address && address.trim()) {
      updatedData.address = address;
      console.log('📍 Updating address:', address);
    } else if (address === undefined) {
      console.log('📍 Address not provided - keeping existing:', user.address);
    }

    if (mapLink && mapLink.trim()) {
      updatedData.mapLink = mapLink;
      console.log('🗺️ Updating map link:', mapLink);
    } else if (mapLink === undefined) {
      console.log('🗺️ Map link not provided - keeping existing:', user.mapLink);
    }

    if (hrEmail && hrEmail.trim()) {
      updatedData.hrEmail = hrEmail;
      console.log('📧 Updating HR Email:', hrEmail);
    } else if (hrEmail === undefined) {
      console.log('📧 HR Email not provided - keeping existing:', user.hrEmail);
    }

    if (hrPhone && hrPhone.trim()) {
      updatedData.hrPhone = hrPhone;
      console.log('☎️ Updating HR Phone:', hrPhone);
    } else if (hrPhone === undefined) {
      console.log('☎️ HR Phone not provided - keeping existing:', user.hrPhone);
    }

    // Handle array fields
    if (mobiles !== undefined && mobiles !== null && mobiles !== '') {
      updatedData.mobiles = Array.isArray(mobiles) ? mobiles.filter(m => m.trim()) : [mobiles];
      console.log('📱 Updating mobiles:', updatedData.mobiles);
    } else if (mobiles === undefined) {
      console.log('📱 Mobiles not provided - keeping existing:', user.mobiles);
    }

    if (emails !== undefined && emails !== null && emails !== '') {
      updatedData.emails = Array.isArray(emails) ? emails.filter(e => e.trim()) : [emails];
      console.log('✉️ Updating emails:', updatedData.emails);
    } else if (emails === undefined) {
      console.log('✉️ Emails not provided - keeping existing:', user.emails);
    }

    if (imgTitle !== undefined && imgTitle !== null && imgTitle !== '') {
      updatedData.imgTitle = Array.isArray(imgTitle) ? imgTitle : [imgTitle];
      console.log('🖼️ Updating image titles:', updatedData.imgTitle);
    } else if (imgTitle === undefined) {
      console.log('🖼️ Image titles not provided - keeping existing:', user.imgTitle);
    }

    if (altName !== undefined && altName !== null && altName !== '') {
      updatedData.altName = Array.isArray(altName) ? altName : [altName];
      console.log('🏷️ Updating alt names:', updatedData.altName);
    } else if (altName === undefined) {
      console.log('🏷️ Alt names not provided - keeping existing:', user.altName);
    }

    console.log('✅ Final Updated Data to Save:', updatedData);

    // Update the user (atomic update)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error('❌ User not found during update');
      return res.status(404).json({ message: 'User not found during update' });
    }

    console.log('✅ User updated successfully:', updatedUser);
    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('❌ Update Error:', error.message);

    // Handle MongoDB validation errors specifically
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.error('❌ Validation errors:', errors);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate field value entered',
        details: error.keyValue,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


 
// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
