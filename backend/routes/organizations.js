const router = require('express').Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Get all orgs
router.get('/', auth(['superadmin', 'officeadmin']), async (req, res) => {
  const orgs = await Organization.find();
  res.json(orgs);
});

// Add org
router.post('/', auth(['superadmin']), async (req, res) => {
  try {
    const org = await Organization.create(req.body);
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit org
router.put('/:id', auth(['superadmin']), async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(org);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add/Edit OfficeAdmin for org
router.post('/:id/officeadmin', auth(['superadmin']), async (req, res) => {
  try {
    const { name, email, password, adminId } = req.body;
    if (adminId) {
      const updates = { name, email };
      if (password) updates.password = await bcrypt.hash(password, 10);
      const updated = await User.findByIdAndUpdate(adminId, updates, { new: true });
      return res.json(updated);
    }
    const hash = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hash, role: 'officeadmin', organization: req.params.id });
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get officeadmins for org
router.get('/:id/officeadmins', auth(['superadmin']), async (req, res) => {
  const admins = await User.find({ organization: req.params.id, role: 'officeadmin' });
  res.json(admins);
});

module.exports = router;
