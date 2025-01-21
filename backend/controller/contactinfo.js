const User = require('../model/contactinfo');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { address, mobiles, emails,imgTitle,altName } = req.body;
console.log(req.file)
   
    // Collect file names
    const photo = req.files.map(file => file.filename);


    const newUser = new User({
      photo,
      address,
      mobiles,
      emails
      ,imgTitle,altName
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
    const { id } = req.query;
    const { address, mobiles, emails, imgTitle, altName } = req.body;

    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let newPhotos = [];

    // Check if new files are uploaded
    if (req.files && req.files.length > 0) {
      newPhotos = req.files.map(file => file.filename);

      // Delete the old images if they exist
      if (user.photo && user.photo.length > 0) {
        user.photo.forEach(image => {
          const oldImagePath = path.join(__dirname, '../photo', image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Old image deleted:', image);
          }
        });
      }
    }

    // Prepare the updated data
    const updatedData = {
      address,
      mobiles,
      emails,
      imgTitle,
      altName,
      ...(newPhotos.length > 0 && { photo: newPhotos }), // Update photos only if new ones are uploaded
    };

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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
