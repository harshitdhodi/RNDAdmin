const Footer = require('../model/footer');

// Create a new footer entry
exports.createFooter = async (req, res) => {
  try {
    const footer = new Footer(req.body);
    const savedFooter = await footer.save();
    res.status(201).json({ message: 'Footer created successfully', data: savedFooter });
  } catch (error) {
    res.status(500).json({ message: 'Error creating footer', error: error.message });
  }
};

// Get all footer entries
exports.getAllFooters = async (req, res) => {
  try {
    const footers = await Footer.find();
    res.status(200).json({ message: 'Footers fetched successfully', data: footers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footers', error: error.message });
  }
};

// Get a single footer entry by ID
exports.getFooterById = async (req, res) => {
  try {
    const footer = await Footer.findById(req.query.id);
    if (!footer) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.status(200).json({ message: 'Footer fetched successfully', data: footer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching footer', error: error.message });
  }
};

// Update a footer entry by ID
exports.updateFooter = async (req, res) => {
  try {
    const updatedFooter = await Footer.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFooter) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.status(200).json({ message: 'Footer updated successfully', data: updatedFooter });
  } catch (error) {
    res.status(500).json({ message: 'Error updating footer', error: error.message });
  }
};

// Delete a footer entry by ID
exports.deleteFooter = async (req, res) => {
  try {
    const deletedFooter = await Footer.findByIdAndDelete(req.query.id);
    if (!deletedFooter) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.status(200).json({ message: 'Footer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting footer', error: error.message });
  }
};
