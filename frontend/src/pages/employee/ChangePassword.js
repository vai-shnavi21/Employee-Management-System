import React, { useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const empId = localStorage.getItem('employeeId');

  const submit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.put(`/employees/${empId}/change-password`, {
        currentPassword: form.currentPassword, newPassword: form.newPassword
      });
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-key me-2 text-primary"></i>Change Password</h5>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><i className="bi bi-shield-lock me-2"></i>Update Your Password</div>
            <div className="card-body">
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input className="form-control" type="password" value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <input className="form-control" type="password" value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm New Password</label>
                  <input className="form-control" type="password" value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
