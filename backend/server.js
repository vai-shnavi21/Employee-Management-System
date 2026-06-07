const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/designations', require('./routes/designations'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/reports', require('./routes/reports'));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed superadmin
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const existing = await User.findOne({ role: 'superadmin' });
    if (!existing) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Super Admin', email: 'superadmin@ems.com', password: hash, role: 'superadmin' });
      console.log('SuperAdmin seeded: superadmin@ems.com / admin123');
    }
  })
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
