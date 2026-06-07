import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

export default function Login() {
  const [tab, setTab] = useState('admin');
  const [form, setForm] = useState({ email: '', password: '', userId: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      if (res.data.organization) localStorage.setItem('organization', JSON.stringify(res.data.organization));
      toast.success(`Welcome, ${res.data.name}`);
      if (res.data.role === 'superadmin') navigate('/superadmin/dashboard');
      else navigate('/officeadmin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleEmpLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/employee-login', { userId: form.userId, password: form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('employeeId', res.data.employeeId);
      toast.success(`Welcome, ${res.data.name}`);
      navigate('/employee/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card bg-white">
        <div style={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)', padding: '30px', textAlign: 'center' }}>
          <i className="bi bi-building-fill text-white" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="text-white mt-2 mb-0">Employee Management System</h4>
          <p className="text-white-50 small">Welcome back, please sign in</p>
        </div>
        <div className="p-4">
          <ul className="nav nav-pills mb-4 justify-content-center">
            <li className="nav-item">
              <button className={`nav-link ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')} style={{ background: tab === 'admin' ? '#1a237e' : '' }}>
                <i className="bi bi-shield-lock me-1"></i> Admin Login
              </button>
            </li>
            <li className="nav-item ms-2">
              <button className={`nav-link ${tab === 'employee' ? 'active' : ''}`} onClick={() => setTab('employee')} style={{ background: tab === 'employee' ? '#1a237e' : '' }}>
                <i className="bi bi-person me-1"></i> Employee Login
              </button>
            </li>
          </ul>

          {tab === 'admin' ? (
            <form onSubmit={handleAdminLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input className="form-control" type="email" placeholder="admin@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input className="form-control" type="password" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmpLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">User ID (Email)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person"></i></span>
                  <input className="form-control" type="email" placeholder="employee@example.com"
                    value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input className="form-control" type="password" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
                Sign In
              </button>
            </form>
          )}
          <p className="text-center text-muted small mt-3">
            <i className="bi bi-info-circle me-1"></i>
            SuperAdmin: superadmin@ems.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
