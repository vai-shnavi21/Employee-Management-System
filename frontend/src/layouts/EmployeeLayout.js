import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmployeeProfile from '../pages/employee/EmployeeProfile';
import ChangePassword from '../pages/employee/ChangePassword';

const menu = [
  { path: '/employee/profile', label: 'My Profile', icon: 'bi-person-circle' },
  { path: '/employee/change-password', label: 'Change Password', icon: 'bi-key' },
];

export default function EmployeeLayout() {
  return (
    <div>
      <Sidebar menuItems={menu} />
      <div className="main-content">
        <Routes>
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="profile" />} />
        </Routes>
      </div>
    </div>
  );
}
