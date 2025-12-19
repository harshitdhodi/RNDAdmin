const User = require('../model/contactinfo');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { address, mobiles, emails, } = req.body;

   
    // Collect file names



    const newUser = new User({
    
      address,
      mobiles,
      emails
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const path = require('path');
const fs = require('fs');

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.query; // or req.params.id depending on your route
    const { address, mobiles, emails } = req.body;

    // Validate ID presence
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate that at least one field is provided for update
    if (!address && !mobiles && !emails) {
      return res.status(400).json({
        message: 'At least one field (address, mobiles, or emails) must be provided for update',
      });
    }

    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare updated data — only include fields that are provided
    const updatedData = {};
    if (address !== undefined) updatedData.address = address;
    if (mobiles !== undefined) updatedData.mobiles = mobiles;
    if (emails !== undefined) updatedData.emails = emails;

    // Optional: Add validation for arrays (mobiles, emails)
    if (mobiles && !Array.isArray(mobiles)) {
      return res.status(400).json({ message: 'mobiles must be an array' });
    }
    if (emails && !Array.isArray(emails)) {
      return res.status(400).json({ message: 'emails must be an array' });
    }

    // Update the user (atomic update)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Use $set to only update provided fields
      { new: true, runValidators: true } // return updated doc + run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found during update' });
    }

    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);

    // Handle MongoDB validation errors specifically
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    // Handle duplicate key errors (e.g., unique email)
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
