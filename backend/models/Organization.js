const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: String,
  phone: String,
  email: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Organization', orgSchema);
