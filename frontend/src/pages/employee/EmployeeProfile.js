import React, { useEffect, useState } from 'react';
import api from '../../api';

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

const Field = ({ label, value }) => (
  <div className="col-md-4 mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-semibold">{value || <span className="text-muted">—</span>}</div>
  </div>
);

export default function EmployeeProfile() {
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const empId = localStorage.getItem('employeeId');

  useEffect(() => {
    api.get(`/employees/${empId}`).then(r => { setEmp(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [empId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!emp) return <div className="alert alert-danger">Could not load profile.</div>;

  return (
    <div>
      <div className="topbar">
        <h5 className="mb-0 fw-bold"><i className="bi bi-person-circle me-2 text-primary"></i>My Profile</h5>
        <span className={`badge ${emp.resigned ? 'badge-resigned' : 'badge-active'} fs-6`}>
          {emp.resigned ? 'Resigned' : 'Active'}
        </span>
      </div>

      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-4">
          {emp.photo
            ? <img src={`/uploads/${emp.photo}`} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1a237e' }} />
            : <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#1a237e' }}>
                <i className="bi bi-person-fill"></i>
              </div>
          }
          <div>
            <h4 className="mb-0">{emp.fullName}</h4>
            <div className="text-muted">{emp.designation?.name} — {emp.department?.name}</div>
            <div className="text-muted small">{emp.organization?.name}</div>
          </div>
        </div>
      </div>

      <CollapsibleSection title="Section 1: Basic Details" icon="bi-person-fill">
        <div className="row">
          <Field label="Employee ID" value={emp.employeeId} />
          <Field label="Full Name" value={emp.fullName} />
          <Field label="Mobile Number" value={emp.mobileNumber} />
          <Field label="Department" value={emp.department?.name} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Section 2: Address Details" icon="bi-geo-alt-fill">
        <div className="row">
          <Field label="Address Line 1" value={emp.addressLine1} />
          <Field label="Address Line 2" value={emp.addressLine2} />
          <Field label="District" value={emp.district} />
          <Field label="Tehsil" value={emp.tehsil} />
          <Field label="City/Village" value={emp.cityVillage} />
          <Field label="Pin Code" value={emp.pinCode} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Section 3: Employment Details" icon="bi-briefcase-fill">
        <div className="row">
          <Field label="Start Date" value={emp.startDate ? new Date(emp.startDate).toLocaleDateString() : ''} />
          <Field label="Designation" value={emp.designation?.name} />
          <Field label="Salary" value={emp.salary ? `₹${Number(emp.salary).toLocaleString()}` : ''} />
          <Field label="Resigned" value={emp.resigned ? 'Yes' : 'No'} />
          {emp.resigned && <Field label="End Date" value={emp.endDate ? new Date(emp.endDate).toLocaleDateString() : ''} />}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Section 4: Login Details" icon="bi-key-fill">
        <div className="row">
          <Field label="User ID (Email)" value={emp.userId} />
          <Field label="Password" value="••••••••" />
        </div>
      </CollapsibleSection>
    </div>
  );
}
