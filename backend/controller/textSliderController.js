
const TextSlider = require('../model/TextSlider');

exports.getTextSlider = async (req, res) => {
  try {
    let textSlider = await TextSlider.findOne();

    // If no data exists, return an empty structure or create a default one
    if (!textSlider) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: textSlider,
    });
  } catch (error) {
    console.error('Error fetching text slider:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create or Update Text Slider Data
// @route   POST /api/text-slider
// @access  Private (Admin)
exports.createOrUpdateTextSlider = async (req, res) => {
  try {
    const { items, isActive } = req.body;

    // Validate input
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of items',
      });
    }

    // Check if a record already exists
    let textSlider = await TextSlider.findOne();

    if (textSlider) {
      // Update existing
      textSlider.items = items;
      if (typeof isActive !== 'undefined') textSlider.isActive = isActive;
      await textSlider.save();
    } else {
      // Create new
      textSlider = new TextSlider({
        items,
        isActive: isActive !== undefined ? isActive : true,
      });
      await textSlider.save();
    }

    res.status(200).json({
      success: true,
      message: 'Text Slider updated successfully',
      data: textSlider,
    });
  } catch (error) {
    console.error('Error updating text slider:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete Text Slider Data
// @route   DELETE /api/text-slider
// @access  Private (Admin)
exports.deleteTextSlider = async (req, res) => {
  try {
    await TextSlider.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Text Slider data deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting text slider:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
