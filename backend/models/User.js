const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'officeadmin', 'employee'], required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  employeeRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
