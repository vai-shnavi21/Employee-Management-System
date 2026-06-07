import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import OfficeAdminLayout from './layouts/OfficeAdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/superadmin/*" element={
          <PrivateRoute role="superadmin"><SuperAdminLayout /></PrivateRoute>
        } />
        <Route path="/officeadmin/*" element={
          <PrivateRoute role="officeadmin"><OfficeAdminLayout /></PrivateRoute>
        } />
        <Route path="/employee/*" element={
          <PrivateRoute role="employee"><EmployeeLayout /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
