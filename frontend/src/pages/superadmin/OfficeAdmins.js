import React, { useEffect, useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

export default function OfficeAdmins() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editAdminId, setEditAdminId] = useState(null);

  useEffect(() => { api.get('/organizations').then(r => setOrgs(r.data)); }, []);

  const loadAdmins = (orgId) => {
    if (orgId) api.get(`/organizations/${orgId}/officeadmins`).then(r => setAdmins(r.data));
    else setAdmins([]);
  };

  const handleOrgChange = e => { setSelectedOrg(e.target.value); loadAdmins(e.target.value); };

  const openAdd = () => { setForm({ name: '', email: '', password: '' }); setEditAdminId(null); setShow(true); };
  const openEdit = a => { setForm({ name: a.name, email: a.email, password: '' }); setEditAdminId(a._id); setShow(true); };

  const save = async e => {
    e.preventDefault();
    if (!selectedOrg) return toast.error('Select an organization first');
    try {
      await api.post(`/organizations/${selectedOrg}/officeadmin`, { ...form, adminId: editAdminId });
      toast.success('Saved'); setShow(false); loadAdmins(selectedOrg);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-person-badge me-2 text-primary"></i>Office Admins</h5>
        <button className="btn btn-primary btn-sm" onClick={openAdd} disabled={!selectedOrg}>
          <i className="bi bi-plus-lg me-1"></i>Add Office Admin
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <label className="form-label fw-semibold">Filter by Organization</label>
          <select className="form-select" value={selectedOrg} onChange={handleOrgChange}>
            <option value="">Select Organization</option>
            {orgs.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>
              {admins.length === 0 && <tr><td colSpan={4} className="text-center text-muted py-4">{selectedOrg ? 'No admins for this org' : 'Select an organization'}</td></tr>}
              {admins.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td><td className="fw-semibold">{a.name}</td><td>{a.email}</td>
                  <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(a)}><i className="bi bi-pencil"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg,#1a237e,#3949ab)', color: 'white' }}>
                <h5 className="modal-title">{editAdminId ? 'Edit' : 'Add'} Office Admin</h5>
                <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
              </div>
              <form onSubmit={save}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password {editAdminId && <span className="text-muted small">(leave blank to keep)</span>}</label>
                    <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editAdminId} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
