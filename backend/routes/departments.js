const router = require('express').Router();
const Department = require('../models/Department');
const auth = require('../middleware/auth');

router.get('/', auth(['superadmin', 'officeadmin', 'employee']), async (req, res) => {
  const filter = {};
  if (req.query.organization) filter.organization = req.query.organization;
  else if (req.user.role === 'officeadmin') filter.organization = req.user.organization;
  const depts = await Department.find(filter).populate('organization', 'name');
  res.json(depts);
});

router.post('/', auth(['superadmin', 'officeadmin']), async (req, res) => {
  try {
    const orgId = req.user.role === 'officeadmin' ? req.user.organization : req.body.organization;
    const dept = await Department.create({ ...req.body, organization: orgId });
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth(['superadmin', 'officeadmin']), async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
