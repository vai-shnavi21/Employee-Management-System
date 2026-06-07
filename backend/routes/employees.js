const router = require('express').Router();
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all employees 
router.get('/', auth(['superadmin', 'officeadmin']), async (req, res) => {
  const filter = {};
  if (req.user.role === 'officeadmin') filter.organization = req.user.organization;
  if (req.query.organization) filter.organization = req.query.organization;
  const emps = await Employee.find(filter)
    .populate('organization', 'name')
    .populate('department', 'name')
    .populate('designation', 'name')
    .select('-password');
  res.json(emps);
});

// Get single employee
router.get('/:id', auth(['superadmin', 'officeadmin', 'employee']), async (req, res) => {
  // Employees can only view their own record
  if (req.user.role === 'employee' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const emp = await Employee.findById(req.params.id)
    .populate('organization', 'name')
    .populate('department', 'name')
    .populate('designation', 'name')
    .select('-password');
  if (!emp) return res.status(404).json({ message: 'Not found' });
  res.json(emp);
});

// Add employee
router.post('/', auth(['officeadmin']), upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body, organization: req.user.organization };
    if (req.file) data.photo = req.file.filename;
    data.password = await bcrypt.hash(data.password, 10);
    data.resigned = data.resigned === 'true' || data.resigned === true;
    const emp = await Employee.create(data);
    res.status(201).json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit employee
router.put('/:id', auth(['officeadmin']), upload.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    else delete data.password;
    data.resigned = data.resigned === 'true' || data.resigned === true;
    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true })
      .populate('department', 'name').populate('designation', 'name');
    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete employee
router.delete('/:id', auth(['officeadmin']), async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Employee updates own password
router.put('/:id/change-password', auth(['employee']), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Not found' });
    const match = await bcrypt.compare(currentPassword, emp.password);
    if (!match) return res.status(400).json({ message: 'Current password incorrect' });
    emp.password = await bcrypt.hash(newPassword, 10);
    await emp.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
