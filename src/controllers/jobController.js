// src/controllers/jobController.js
const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
  const { title, description, service, address, basePrice, location } = req.body;
  try {
    const job = await Job.create({
      customer: req.user._id,
      title, description, service, address, basePrice, location
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};