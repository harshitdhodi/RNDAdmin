const Counter = require('../model/counter');

exports.createCounter = async (req, res) => {
  try {
    const { title, count, sign, icon, status } = req.body;
    const newCounter = new Counter({ title, count, sign, icon, status });
    await newCounter.save();
    res.status(201).json(newCounter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCounters = async (req, res) => {
  try {
    const counters = await Counter.find();
    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCounterById = async (req, res) => {
  try {
    const counter = await Counter.findById(req.query.id);
    if (!counter) return res.status(404).json({ message: 'Counter not found' });
    res.status(200).json(counter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCounter = async (req, res) => {
  try {
    const updatedCounter = await Counter.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    );
    if (!updatedCounter) return res.status(404).json({ message: 'Counter not found' });
    res.status(200).json(updatedCounter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCounter = async (req, res) => {
  try {
    const deletedCounter = await Counter.findByIdAndDelete(req.query.id);
    if (!deletedCounter) return res.status(404).json({ message: 'Counter not found' });
    res.status(200).json({ message: 'Counter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
