import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/officeadmin/Dashboard';
import EmployeeList from '../pages/officeadmin/EmployeeList';
import EmployeeForm from '../pages/officeadmin/EmployeeForm';
import Reports from '../pages/officeadmin/Reports';
import OADepartments from '../pages/officeadmin/OADepartments';
import OADesignations from '../pages/officeadmin/OADesignations';

const menu = [
  { path: '/officeadmin/dashboard', label: 'Dashboard', icon: 'bi-grid' },
  { path: '/officeadmin/employees', label: 'Employees', icon: 'bi-people' },
  { path: '/officeadmin/departments', label: 'Departments', icon: 'bi-diagram-3' },
  { path: '/officeadmin/designations', label: 'Designations', icon: 'bi-award' },
  { path: '/officeadmin/reports', label: 'Reports', icon: 'bi-bar-chart' },
];

export default function OfficeAdminLayout() {
  return (
    <div>
      <Sidebar menuItems={menu} />
      <div className="main-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/edit/:id" element={<EmployeeForm />} />
          <Route path="departments" element={<OADepartments />} />
          <Route path="designations" element={<OADesignations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}
