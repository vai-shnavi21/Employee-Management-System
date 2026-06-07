import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const StatCard = ({ label, value, icon, color, onClick }) => (
  <div className="col-md-3" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
    <div className="stat-card" style={{ background: color }}>
      <div className="small text-white-50 mb-1">{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{value}</div>
      <i className={`bi ${icon} icon`}></i>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, resigned: 0, depts: 0 });
  const [recent, setRecent] = useState([]);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/employees').then(r => {
      const emps = r.data;
      setStats({
        total: emps.length,
        active: emps.filter(e => !e.resigned).length,
        resigned: emps.filter(e => e.resigned).length,
      });
      setRecent(emps.slice(-5).reverse());
    });
    api.get('/departments').then(r => setStats(s => ({ ...s, depts: r.data.length })));
  }, []);

  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold">Welcome back, {name}</h5>
          <div className="text-muted small">Office Admin Dashboard</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/officeadmin/employees/new')}>
          <i className="bi bi-plus-lg me-1"></i>Add Employee
        </button>
      </div>
      <div className="row g-3 mb-4">
        <StatCard label="Total Employees" value={stats.total} icon="bi-people" color="linear-gradient(135deg,#1a237e,#3949ab)" onClick={() => navigate('/officeadmin/employees')} />
        <StatCard label="Active" value={stats.active} icon="bi-person-check" color="linear-gradient(135deg,#00695c,#00897b)" />
        <StatCard label="Resigned" value={stats.resigned} icon="bi-person-dash" color="linear-gradient(135deg,#b71c1c,#c62828)" />
        <StatCard label="Departments" value={stats.depts} icon="bi-diagram-3" color="linear-gradient(135deg,#e65100,#ef6c00)" onClick={() => navigate('/officeadmin/departments')} />
      </div>
      <div className="card">
        <div className="card-header"><i className="bi bi-clock-history me-2"></i>Recently Added Employees</div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead><tr><th>Name</th><th>Employee ID</th><th>Department</th><th>Status</th></tr></thead>
            <tbody>
              {recent.length === 0 && <tr><td colSpan={4} className="text-center text-muted py-3">No employees yet</td></tr>}
              {recent.map(e => (
                <tr key={e._id}>
                  <td className="fw-semibold">{e.fullName}</td>
                  <td>{e.employeeId}</td>
                  <td>{e.department?.name}</td>
                  <td><span className={`badge ${e.resigned ? 'badge-resigned' : 'badge-active'}`}>{e.resigned ? 'Resigned' : 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
