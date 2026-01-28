const SocialMedia = require('../model/socialMedia');

const createSocialMedia = async (req, res) => {
  try {
    const { name, link, status } = req.body;
    const socialMedia = new SocialMedia({ name, link, status });
    await socialMedia.save();
    res.status(201).json({ message: 'Social media link added successfully', data: socialMedia });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find();
    res.status(200).json(socialMedia);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSocialMediaById = async (req, res) => {
  try {
    const { id } = req.query;
    const socialMedia = await SocialMedia.findById(id);
    if (!socialMedia) {
      return res.status(404).json({ message: 'Social media link not found' });
    }
    res.status(200).json(socialMedia);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, link, status } = req.body;
    
    const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
      id,
      { name, link, status },
      { new: true }
    );

    if (!updatedSocialMedia) {
      return res.status(404).json({ message: 'Social media link not found' });
    }

    res.status(200).json({ message: 'Social media link updated successfully', data: updatedSocialMedia });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedSocialMedia = await SocialMedia.findByIdAndDelete(id);

    if (!deletedSocialMedia) {
      return res.status(404).json({ message: 'Social media link not found' });
    }

    res.status(200).json({ message: 'Social media link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSocialMedia,
  getAllSocialMedia,
  getSocialMediaById,
  updateSocialMedia,
  deleteSocialMedia
};