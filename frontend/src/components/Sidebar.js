import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ menuItems, title }) {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const roleLabel = { superadmin: 'Super Admin', officeadmin: 'Office Admin', employee: 'Employee' }[role];
  const org = localStorage.getItem('organization');
  const orgName = org ? JSON.parse(org)?.name : null;

  return (
    <div className="sidebar d-flex flex-column">
      <div className="text-center py-4 px-3 border-bottom border-white border-opacity-10">
        <i className="bi bi-building-fill" style={{ fontSize: '2rem' }}></i>
        <div className="fw-bold mt-1" style={{ fontSize: '1rem' }}>EMS</div>
        <div className="small opacity-75">{title || roleLabel}</div>
        {orgName && <div className="small opacity-50" style={{ fontSize: '0.7rem' }}>{orgName}</div>}
      </div>

      <div className="px-2 py-2 border-bottom border-white border-opacity-10">
        <div className="d-flex align-items-center px-2 py-2">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="ms-2">
            <div className="small fw-semibold text-truncate" style={{ maxWidth: 160 }}>{name}</div>
            <div className="text-white-50" style={{ fontSize: '0.7rem' }}>{roleLabel}</div>
          </div>
        </div>
      </div>

      <nav className="flex-grow-1 py-2">
        {menuItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}>
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <button className="btn btn-outline-light w-100 btn-sm" onClick={logout}>
          <i className="bi bi-box-arrow-left me-2"></i>Logout
        </button>
      </div>
    </div>
  );
}
