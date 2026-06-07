import React, { useEffect, useState } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

const emptyForm = { name: '', address: '', phone: '', email: '' };

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/organizations').then(r => setOrgs(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShow(true); };
  const openEdit = o => { setForm({ name: o.name, address: o.address || '', phone: o.phone || '', email: o.email || '' }); setEditId(o._id); setShow(true); };

  const save = async e => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/organizations/${editId}`, form);
      else await api.post('/organizations', form);
      toast.success('Saved successfully');
      setShow(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-building me-2 text-primary"></i>Organizations</h5>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <i className="bi bi-plus-lg me-1"></i>Add Organization
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">No organizations yet</td></tr>}
              {orgs.map((o, i) => (
                <tr key={o._id}>
                  <td>{i + 1}</td>
                  <td className="fw-semibold">{o.name}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>
                  <td>{o.address}</td>
                  <td><span className={`badge ${o.isActive ? 'bg-success' : 'bg-danger'}`}>{o.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(o)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
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
                <h5 className="modal-title">{editId ? 'Edit' : 'Add'} Organization</h5>
                <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
              </div>
              <form onSubmit={save}>
                <div className="modal-body">
                  {[['name', 'Organization Name', 'text', true], ['email', 'Email', 'email', false], ['phone', 'Phone', 'text', false], ['address', 'Address', 'text', false]].map(([k, l, t, req]) => (
                    <div className="mb-3" key={k}>
                      <label className="form-label fw-semibold">{l}</label>
                      <input className="form-control" type={t} value={form[k]} required={req}
                        onChange={e => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
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
