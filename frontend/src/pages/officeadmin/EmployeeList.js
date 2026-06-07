import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast } from 'react-toastify';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = () => api.get('/employees').then(r => setEmployees(r.data));
  useEffect(() => { load(); }, []);

  const deleteEmp = async (id, name) => {
    if (!window.confirm(`Delete employee "${name}"?`)) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-people me-2 text-primary"></i>Employees</h5>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/officeadmin/employees/new')}>
          <i className="bi bi-plus-lg me-1"></i>Add Employee
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body py-2">
          <input className="form-control" placeholder="Search by name, ID, department..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Photo</th><th>Employee ID</th><th>Full Name</th><th>Mobile</th>
                  <th>Department</th><th>Designation</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-muted py-4">No employees found</td></tr>}
                {filtered.map(e => (
                  <tr key={e._id}>
                    <td>
                      {e.photo
                        ? <img src={`/uploads/${e.photo}`} alt="" className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                        : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-person text-primary"></i>
                          </div>
                      }
                    </td>
                    <td className="fw-semibold">{e.employeeId}</td>
                    <td>{e.fullName}</td>
                    <td>{e.mobileNumber}</td>
                    <td>{e.department?.name}</td>
                    <td>{e.designation?.name}</td>
                    <td>
                      <span className={`badge ${e.resigned ? 'badge-resigned' : 'badge-active'}`}>
                        {e.resigned ? 'Resigned' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => navigate(`/officeadmin/employees/edit/${e._id}`)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteEmp(e._id, e.fullName)}>
                        <i className="bi bi-trash"></i>
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
