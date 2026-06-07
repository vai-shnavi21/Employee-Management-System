import React, { useEffect, useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

export default function Departments() {
  const [depts, setDepts] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', organization: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = () => Promise.all([api.get('/departments'), api.get('/organizations')])
    .then(([d, o]) => { setDepts(d.data); setOrgs(o.data); });
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ name: '', organization: '', description: '' }); setEditId(null); setShow(true); };
  const openEdit = d => { setForm({ name: d.name, organization: d.organization?._id || '', description: d.description || '' }); setEditId(d._id); setShow(true); };

  const save = async e => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/departments/${editId}`, form);
      else await api.post('/departments', form);
      toast.success('Saved'); setShow(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-diagram-3 me-2 text-primary"></i>Departments</h5>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><i className="bi bi-plus-lg me-1"></i>Add Department</button>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead><tr><th>#</th><th>Name</th><th>Organization</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {depts.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">No departments yet</td></tr>}
              {depts.map((d, i) => (
                <tr key={d._id}>
                  <td>{i + 1}</td><td className="fw-semibold">{d.name}</td>
                  <td>{d.organization?.name}</td><td>{d.description}</td>
                  <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(d)}><i className="bi bi-pencil"></i></button></td>
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
                <h5 className="modal-title">{editId ? 'Edit' : 'Add'} Department</h5>
                <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
              </div>
              <form onSubmit={save}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Organization</label>
                    <select className="form-select" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} required>
                      <option value="">Select Organization</option>
                      {orgs.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Department Name</label>
                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <input className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
