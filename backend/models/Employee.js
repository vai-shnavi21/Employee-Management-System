const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  photo: String,
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },

  // Address
  addressLine1: String,
  addressLine2: String,
  district: String,
  tehsil: String,
  cityVillage: String,
  pinCode: String,

  // Employment
  startDate: { type: Date, required: true },
  resigned: { type: Boolean, default: false },
  endDate: Date,
  designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
  salary: Number,

  // Login
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
