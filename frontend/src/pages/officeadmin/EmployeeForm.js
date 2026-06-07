import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../../api';
import { toast } from 'react-toastify';

const CollapsibleSection = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-3">
      <div className="section-collapse">
        <div className="section-header d-flex justify-content-between align-items-center" onClick={() => setOpen(!open)}>
          <span className="fw-semibold"><i className={`bi ${icon} me-2 text-primary`}></i>{title}</span>
          <i className={`bi bi-chevron-${open ? 'up' : 'down'} text-primary`}></i>
        </div>
      </div>
      {open && <div className="card card-body mt-1">{children}</div>}
    </div>
  );
};

const initialForm = {
  employeeId: '', fullName: '', mobileNumber: '', department: '', photo: null,
  addressLine1: '', addressLine2: '', district: '', tehsil: '', cityVillage: '', pinCode: '',
  startDate: '', resigned: false, endDate: '', designation: '', salary: '',
  userId: '', password: ''
};

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [depts, setDepts] = useState([]);
  const [desigs, setDesigs] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/departments').then(r => setDepts(r.data));
    api.get('/designations').then(r => setDesigs(r.data));
    if (isEdit) {
      api.get(`/employees/${id}`).then(r => {
        const e = r.data;
        setForm({
          employeeId: e.employeeId, fullName: e.fullName, mobileNumber: e.mobileNumber,
          department: e.department?._id || '', photo: null,
          addressLine1: e.addressLine1 || '', addressLine2: e.addressLine2 || '',
          district: e.district || '', tehsil: e.tehsil || '',
          cityVillage: e.cityVillage || '', pinCode: e.pinCode || '',
          startDate: e.startDate ? e.startDate.split('T')[0] : '',
          resigned: e.resigned, endDate: e.endDate ? e.endDate.split('T')[0] : '',
          designation: e.designation?._id || '', salary: e.salary || '',
          userId: e.userId, password: ''
        });
        if (e.photo) setPreview(`/uploads/${e.photo}`);
      });
    }
  }, [id, isEdit]);

  const onDrop = useCallback(accepted => {
    if (accepted[0]) {
      setForm(f => ({ ...f, photo: accepted[0] }));
      setPreview(URL.createObjectURL(accepted[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'photo') { if (v) data.append('photo', v); }
        else data.append(k, v ?? '');
      });
      if (isEdit) await api.put(`/employees/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/employees', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(isEdit ? 'Employee updated' : 'Employee added');
      navigate('/officeadmin/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-person-plus me-2 text-primary"></i>{isEdit ? 'Edit Employee' : 'Add Employee'}
        </h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/officeadmin/employees')}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
      </div>

      <form onSubmit={submit}>
        <CollapsibleSection title="Section 1: Basic Details" icon="bi-person-fill">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Employee ID</label>
              <input className="form-control" value={form.employeeId} onChange={e => set('employeeId', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input className="form-control" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Mobile Number</label>
              <input className="form-control" value={form.mobileNumber} onChange={e => set('mobileNumber', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Department</label>
              <select className="form-select" value={form.department} onChange={e => set('department', e.target.value)} required>
                <option value="">Select Department</option>
                {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Photo</label>
              <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {preview
                  ? <div className="text-center"><img src={preview} alt="preview" className="avatar-preview mb-2" /><br/><small className="text-muted">Click or drag to change</small></div>
                  : <div><i className="bi bi-cloud-upload fs-3 text-primary"></i><p className="mb-0 mt-1">{isDragActive ? 'Drop here...' : 'Drag & drop photo or click to browse'}</p></div>
                }
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Section 2: Address Details" icon="bi-geo-alt-fill">
          <div className="row g-3">
            {[['addressLine1','Address Line 1',6],['addressLine2','Address Line 2',6],
              ['district','District',4],['tehsil','Tehsil',4],
              ['cityVillage','City/Village',4],['pinCode','Pin Code',4]].map(([k, l, col]) => (
              <div className={`col-md-${col}`} key={k}>
                <label className="form-label fw-semibold">{l}</label>
                <input className="form-control" value={form[k]} onChange={e => set(k, e.target.value)} />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Section 3: Employment Details" icon="bi-briefcase-fill">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Start Date</label>
              <input className="form-control" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Designation</label>
              <select className="form-select" value={form.designation} onChange={e => set('designation', e.target.value)}>
                <option value="">Select Designation</option>
                {desigs.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Salary</label>
              <input className="form-control" type="number" value={form.salary} onChange={e => set('salary', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Resigned</label>
              <select className="form-select" value={form.resigned ? 'true' : 'false'} onChange={e => set('resigned', e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            {form.resigned && (
              <div className="col-md-4">
                <label className="form-label fw-semibold">End Date</label>
                <input className="form-control" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Section 4: Login Details" icon="bi-key-fill">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">User ID (Email)</label>
              <input className="form-control" type="email" value={form.userId} onChange={e => set('userId', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Password {isEdit && <span className="text-muted small">(leave blank to keep)</span>}</label>
              <input className="form-control" type="password" value={form.password} onChange={e => set('password', e.target.value)} required={!isEdit} />
            </div>
          </div>
        </CollapsibleSection>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/officeadmin/employees')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            {isEdit ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
