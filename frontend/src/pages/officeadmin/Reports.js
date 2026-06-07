import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [depts, setDepts] = useState([]);
  const [filters, setFilters] = useState({ department: '', salaryMin: '', salaryMax: '', fromDate: '', toDate: '', resigned: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { api.get('/departments').then(r => setDepts(r.data)); }, []);

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const search = async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v !== '') params[k] = v; });
    const r = await api.get('/reports', { params });
    setEmployees(r.data);
    setLoading(false);
  };

  useEffect(() => { search(); }, []); // load all on mount

  const buildExportParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== '') params.append(k, v); });
    return params.toString();
  };

  const exportFile = (type) => {
    const token = localStorage.getItem('token');
    const q = buildExportParams();
    const url = `/api/reports/export/${type}${q ? '?' + q : ''}`;
    const a = document.createElement('a');
    a.href = url;
    // Pass auth via header not possible for downloads, so we use a temp approach
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const bUrl = URL.createObjectURL(blob);
        a.href = bUrl;
        a.download = `employees.${type === 'excel' ? 'xlsx' : type}`;
        a.click();
        URL.revokeObjectURL(bUrl);
      });
  };

  const reset = () => {
    const cleared = { department: '', salaryMin: '', salaryMax: '', fromDate: '', toDate: '', resigned: '' };
    setFilters(cleared);
    // re-fetch with cleared filters immediately
    setLoading(true);
    api.get('/reports').then(r => { setEmployees(r.data); setLoading(false); });
  };

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-bar-chart me-2 text-primary"></i>Employee Reports</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => exportFile('excel')}><i className="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button className="btn btn-secondary btn-sm" onClick={() => exportFile('csv')}><i className="bi bi-filetype-csv me-1"></i>CSV</button>
          <button className="btn btn-danger btn-sm" onClick={() => exportFile('pdf')}><i className="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header"><i className="bi bi-funnel me-2"></i>Filters</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Department</label>
              <select className="form-select form-select-sm" value={filters.department} onChange={e => setF('department', e.target.value)}>
                <option value="">All Departments</option>
                {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold small">Min Salary</label>
              <input className="form-control form-control-sm" type="number" placeholder="0" value={filters.salaryMin} onChange={e => setF('salaryMin', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold small">Max Salary</label>
              <input className="form-control form-control-sm" type="number" placeholder="Any" value={filters.salaryMax} onChange={e => setF('salaryMax', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold small">Joined From</label>
              <input className="form-control form-control-sm" type="date" value={filters.fromDate} onChange={e => setF('fromDate', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold small">Joined To</label>
              <input className="form-control form-control-sm" type="date" value={filters.toDate} onChange={e => setF('toDate', e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold small">Status</label>
              <select className="form-select form-select-sm" value={filters.resigned} onChange={e => setF('resigned', e.target.value)}>
                <option value="">All</option>
                <option value="false">Active</option>
                <option value="true">Resigned</option>
              </select>
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={search}><i className="bi bi-search me-1"></i>Apply Filters</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { reset(); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom">
            <span className="text-muted small">Showing <strong>{employees.length}</strong> record(s)</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Employee ID</th><th>Full Name</th><th>Mobile</th>
                  <th>Department</th><th>Designation</th><th>Start Date</th>
                  <th>Salary</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={10} className="text-center py-4"><div className="spinner-border text-primary"></div></td></tr>}
                {!loading && employees.length === 0 && <tr><td colSpan={10} className="text-center text-muted py-4">No records found</td></tr>}
                {!loading && employees.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{e.employeeId}</td>
                    <td>{e.fullName}</td>
                    <td>{e.mobileNumber}</td>
                    <td>{e.department?.name}</td>
                    <td>{e.designation?.name}</td>
                    <td>{e.startDate ? new Date(e.startDate).toLocaleDateString() : '-'}</td>
                    <td>{e.salary ? `₹${Number(e.salary).toLocaleString()}` : '-'}</td>
                    <td>
                      <span className={`badge ${e.resigned ? 'badge-resigned' : 'badge-active'}`}>
                        {e.resigned ? 'Resigned' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/officeadmin/employees/edit/${e._id}`)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
