import React, { useEffect, useState } from 'react';
import api from '../../api';

const StatCard = ({ label, value, icon, color }) => (
  <div className="col-md-3">
    <div className="stat-card" style={{ background: color }}>
      <div className="small text-white-50 mb-1">{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700 }}>{value}</div>
      <i className={`bi ${icon} icon`}></i>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ orgs: 0, depts: 0, desigs: 0, admins: 0 });
  const name = localStorage.getItem('name');

  useEffect(() => {
    Promise.all([
      api.get('/organizations'),
      api.get('/departments'),
      api.get('/designations'),
    ]).then(([o, d, des]) => {
      setStats({ orgs: o.data.length, depts: d.data.length, desigs: des.data.length });
    });
  }, []);

  return (
    <div>
      <div className="topbar">
        <div>
          <h5 className="mb-0 fw-bold">Welcome back, {name}</h5>
          <div className="text-muted small">Super Admin Dashboard</div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <StatCard label="Organizations" value={stats.orgs} icon="bi-building" color="linear-gradient(135deg,#1a237e,#3949ab)" />
        <StatCard label="Departments" value={stats.depts} icon="bi-diagram-3" color="linear-gradient(135deg,#00695c,#00897b)" />
        <StatCard label="Designations" value={stats.desigs} icon="bi-award" color="linear-gradient(135deg,#e65100,#ef6c00)" />
        <StatCard label="Role" value="SuperAdmin" icon="bi-shield-check" color="linear-gradient(135deg,#4527a0,#7b1fa2)" />
      </div>
      <div className="card">
        <div className="card-header"><i className="bi bi-info-circle me-2"></i>Quick Guide</div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><i className="bi bi-building text-primary me-2"></i><strong>Organizations</strong> — Add and manage company organizations</li>
            <li className="list-group-item"><i className="bi bi-diagram-3 text-success me-2"></i><strong>Departments</strong> — Create departments under organizations</li>
            <li className="list-group-item"><i className="bi bi-award text-warning me-2"></i><strong>Designations</strong> — Define job designations per organization</li>
            <li className="list-group-item"><i className="bi bi-person-badge text-danger me-2"></i><strong>Office Admins</strong> — Assign office admins to manage each organization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
