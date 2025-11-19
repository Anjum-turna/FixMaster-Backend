// src/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  icon: String,
  category: String
});

module.exports = mongoose.model('Service', serviceSchema);