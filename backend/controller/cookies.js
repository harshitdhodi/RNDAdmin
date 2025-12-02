const Cookies = require('../model/cookies');
const express = require('express');
const app = express();

// Increase payload limit
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Create a new cookies document
const createCookies = async (req, res) => {
  try {
    const { cookiesPolicy } = req.body;
    const newCookies = new Cookies({ cookiesPolicy });
    await newCookies.save();
    res.status(201).json(newCookies);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cookies document", details: error.message });
  }
};

// Get all cookies documents
const getAllCookies = async (req, res) => {
  try {
    const cookiesDocs = await Cookies.find();
    res.status(200).json(cookiesDocs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cookies documents', details: error.message });
  }
};

// Get a single cookies document by ID
const getCookiesById = async (req, res) => {
  try {
    const cookiesDoc = await Cookies.findById(req.params.id);
    if (!cookiesDoc) {
      return res.status(404).json({ error: 'Cookies document not found' });
    }
    res.status(200).json(cookiesDoc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cookies document', details: error.message });
  }
};

// Update a cookies document by ID
const updateCookies = async (req, res) => {
  try {
    const { cookiesPolicy } = req.body;
    const updatedCookies = await Cookies.findByIdAndUpdate(
      req.params.id,
      { cookiesPolicy },
      { new: true }
    );
    if (!updatedCookies) {
      return res.status(404).json({ error: 'Cookies document not found' });
    }
    res.status(200).json(updatedCookies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cookies document', details: error.message });
  }
};

// Delete a cookies document by ID
const deleteCookies = async (req, res) => {
  try {
    const cookiesDoc = await Cookies.findByIdAndDelete(req.params.id);
    if (!cookiesDoc) {
      return res.status(404).json({ error: 'Cookies document not found' });
    }
    res.status(200).json({ message: 'Cookies document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cookies document', details: error.message });
  }
};

module.exports = {
  createCookies,
  getAllCookies,
  getCookiesById,
  updateCookies,
  deleteCookies,
};