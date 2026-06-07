const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Login for superadmin / officeadmin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('organization');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization?._id, organizationName: user.organization?.name },
      process.env.JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, role: user.role, name: user.name, organization: user.organization });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Employee login
router.post('/employee-login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const employee = await Employee.findOne({ userId })
      .populate('organization').populate('department').populate('designation');
    if (!employee) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: employee._id, role: 'employee', organization: employee.organization?._id },
      process.env.JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, role: 'employee', name: employee.fullName, employeeId: employee._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
