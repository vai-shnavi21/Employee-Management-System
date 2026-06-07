import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/superadmin/Dashboard';
import Organizations from '../pages/superadmin/Organizations';
import Departments from '../pages/superadmin/Departments';
import Designations from '../pages/superadmin/Designations';
import OfficeAdmins from '../pages/superadmin/OfficeAdmins';

const menu = [
  { path: '/superadmin/dashboard', label: 'Dashboard', icon: 'bi-grid' },
  { path: '/superadmin/organizations', label: 'Organizations', icon: 'bi-building' },
  { path: '/superadmin/departments', label: 'Departments', icon: 'bi-diagram-3' },
  { path: '/superadmin/designations', label: 'Designations', icon: 'bi-award' },
  { path: '/superadmin/officeadmins', label: 'Office Admins', icon: 'bi-person-badge' },
];

export default function SuperAdminLayout() {
  return (
    <div>
      <Sidebar menuItems={menu} />
      <div className="main-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="departments" element={<Departments />} />
          <Route path="designations" element={<Designations />} />
          <Route path="officeadmins" element={<OfficeAdmins />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}
