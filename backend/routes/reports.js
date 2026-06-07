const router = require('express').Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const buildFilter = (user, query) => {
  const filter = {};
  if (user.role === 'officeadmin') filter.organization = user.organization;
  if (query.department) filter.department = query.department;
  if (query.resigned !== undefined && query.resigned !== '') filter.resigned = query.resigned === 'true';
  if (query.salaryMin || query.salaryMax) {
    filter.salary = {};
    if (query.salaryMin) filter.salary.$gte = Number(query.salaryMin);
    if (query.salaryMax) filter.salary.$lte = Number(query.salaryMax);
  }
  if (query.fromDate || query.toDate) {
    filter.startDate = {};
    if (query.fromDate) filter.startDate.$gte = new Date(query.fromDate);
    if (query.toDate) filter.startDate.$lte = new Date(query.toDate);
  }
  return filter;
};

router.get('/', auth(['officeadmin', 'superadmin']), async (req, res) => {
  const filter = buildFilter(req.user, req.query);
  const employees = await Employee.find(filter)
    .populate('department', 'name')
    .populate('designation', 'name')
    .populate('organization', 'name')
    .select('-password');
  res.json(employees);
});

router.get('/export/excel', auth(['officeadmin', 'superadmin']), async (req, res) => {
  const filter = buildFilter(req.user, req.query);
  const employees = await Employee.find(filter)
    .populate('department', 'name').populate('designation', 'name').select('-password');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Employees');
  sheet.columns = [
    { header: 'Employee ID', key: 'employeeId' },
    { header: 'Full Name', key: 'fullName' },
    { header: 'Mobile', key: 'mobileNumber' },
    { header: 'Department', key: 'department' },
    { header: 'Designation', key: 'designation' },
    { header: 'Start Date', key: 'startDate' },
    { header: 'Salary', key: 'salary' },
    { header: 'Resigned', key: 'resigned' },
    { header: 'City', key: 'cityVillage' },
  ];
  employees.forEach(e => sheet.addRow({
    employeeId: e.employeeId, fullName: e.fullName, mobileNumber: e.mobileNumber,
    department: e.department?.name, designation: e.designation?.name,
    startDate: e.startDate ? new Date(e.startDate).toLocaleDateString() : '',
    salary: e.salary, resigned: e.resigned ? 'Yes' : 'No', cityVillage: e.cityVillage
  }));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

router.get('/export/csv', auth(['officeadmin', 'superadmin']), async (req, res) => {
  const filter = buildFilter(req.user, req.query);
  const employees = await Employee.find(filter)
    .populate('department', 'name').populate('designation', 'name').select('-password');

  const headers = 'Employee ID,Full Name,Mobile,Department,Designation,Start Date,Salary,Resigned,City';
  const rows = employees.map(e => [
    e.employeeId, e.fullName, e.mobileNumber,
    e.department?.name, e.designation?.name,
    e.startDate ? new Date(e.startDate).toLocaleDateString() : '',
    e.salary, e.resigned ? 'Yes' : 'No', e.cityVillage
  ].map(v => `"${v ?? ''}"`).join(','));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
  res.send([headers, ...rows].join('\n'));
});

router.get('/export/pdf', auth(['officeadmin', 'superadmin']), async (req, res) => {
  const filter = buildFilter(req.user, req.query);
  const employees = await Employee.find(filter)
    .populate('department', 'name').populate('designation', 'name').select('-password');

  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=employees.pdf');
  doc.pipe(res);

  doc.fontSize(16).text('Employee Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(9);

  const headers = ['ID', 'Name', 'Mobile', 'Department', 'Designation', 'Start Date', 'Salary', 'Resigned'];
  const colW = [60, 100, 80, 80, 80, 70, 60, 50];
  let x = 30, y = doc.y;

  headers.forEach((h, i) => { doc.text(h, x, y, { width: colW[i], align: 'left' }); x += colW[i]; });
  doc.moveDown(0.5);
  doc.moveTo(30, doc.y).lineTo(780, doc.y).stroke();

  employees.forEach(e => {
    x = 30; y = doc.y + 4;
    const row = [e.employeeId, e.fullName, e.mobileNumber, e.department?.name, e.designation?.name,
      e.startDate ? new Date(e.startDate).toLocaleDateString() : '', e.salary, e.resigned ? 'Yes' : 'No'];
    row.forEach((val, i) => { doc.text(String(val ?? ''), x, y, { width: colW[i] }); x += colW[i]; });
    doc.moveDown(0.3);
  });

  doc.end();
});

module.exports = router;
