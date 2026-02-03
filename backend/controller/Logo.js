const Logo = require('../model/Logo');
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, '..', 'logos');

/* ================== HELPERS ================== */

// always store .webp in DB
const normalizeWebp = (filename) => {
  if (!filename) return '';
  return filename.replace(/\.(png|jpg|jpeg|svg)$/i, '.webp');
};

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(LOGO_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/* ================== ADD LOGO ================== */

const addLogo = async (req, res) => {
  try {
    if (!req.files?.headerLogo || !req.files?.favIcon) {
      return res.status(400).json({
        success: false,
        message: 'headerLogo and favIcon are required'
      });
    }

    const existing = await Logo.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Logo already exists. Use update instead.'
      });
    }

    const logo = await Logo.create({
      headerLogo: normalizeWebp(req.files.headerLogo[0].filename),
      headerLogoName: req.body.headerLogoName || '',
      headerLogoAltName: req.body.headerLogoAltName || '',

      favIcon: normalizeWebp(req.files.favIcon[0].filename),
      favIconName: req.body.favIconName || '',
      favIconAltName: req.body.favIconAltName || '',

      footerLogo: req.files.footerLogo
        ? normalizeWebp(req.files.footerLogo[0].filename)
        : '',

      footerLogoName: req.body.footerLogoName || '',
      footerLogoAltName: req.body.footerLogoAltName || '',
      tagline: req.body.tagline || ''
    });

    res.status(201).json({
      success: true,
      message: 'Logo added successfully',
      data: logo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== UPDATE LOGO ================== */

const updateLogo = async (req, res) => {
  try {
    let logo = await Logo.findOne();
    const isNew = !logo;

    if (!logo) logo = new Logo({});

    // delete old files only if replaced
    if (!isNew) {
      if (req.files?.headerLogo) deleteFile(logo.headerLogo);
      if (req.files?.favIcon) deleteFile(logo.favIcon);
      if (req.files?.footerLogo) deleteFile(logo.footerLogo);
    }

    logo.headerLogo = req.files?.headerLogo
      ? normalizeWebp(req.files.headerLogo[0].filename)
      : normalizeWebp(logo.headerLogo);

    logo.favIcon = req.files?.favIcon
      ? normalizeWebp(req.files.favIcon[0].filename)
      : normalizeWebp(logo.favIcon);

    logo.footerLogo = req.files?.footerLogo
      ? normalizeWebp(req.files.footerLogo[0].filename)
      : normalizeWebp(logo.footerLogo);

    logo.headerLogoName = req.body.headerLogoName ?? logo.headerLogoName;
    logo.headerLogoAltName = req.body.headerLogoAltName ?? logo.headerLogoAltName;
    logo.favIconName = req.body.favIconName ?? logo.favIconName;
    logo.favIconAltName = req.body.favIconAltName ?? logo.favIconAltName;
    logo.footerLogoName = req.body.footerLogoName ?? logo.footerLogoName;
    logo.footerLogoAltName = req.body.footerLogoAltName ?? logo.footerLogoAltName;
    logo.tagline = req.body.tagline ?? logo.tagline;

    await logo.save();

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Logo added successfully' : 'Logo updated successfully',
      data: logo
    });
  } catch (error) {
    console.error('Update logo error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== GET LOGO ================== */

const getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    if (!logo) {
      return res.status(404).json({
        success: false,
        message: 'Logo not found'
      });
    }

    res.json({ success: true, data: logo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== DELETE LOGO ================== */

const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findOneAndDelete();
    if (!logo) {
      return res.status(404).json({
        success: false,
        message: 'Logo not found'
      });
    }

    deleteFile(logo.headerLogo);
    deleteFile(logo.favIcon);
    deleteFile(logo.footerLogo);

    res.json({ success: true, message: 'Logo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== EXPORTS ================== */

module.exports = {
  addLogo,
  updateLogo,
  getLogo,
  deleteLogo
};
