<<<<<<< HEAD
# Employee Management System

A  application with role-based access for SuperAdmin, OfficeAdmin, and Employee.


## Setup & Run

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:5000
SuperAdmin seeded automatically: `superadmin@ems.com` / `admin123`

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on http://localhost:3000

## User Roles

| Role | Login | Credentials |
|------|-------|------------|
| SuperAdmin | Admin tab | superadmin@ems.com / admin123 |
| OfficeAdmin | Admin tab | (created by SuperAdmin) |
| Employee | Employee tab | (created by OfficeAdmin) |

## Features
- SuperAdmin: Manage Organizations, Departments, Designations, Office Admins
- OfficeAdmin: Full Employee CRUD, Reports with filters, Export Excel/CSV/PDF
- Employee: View profile in collapsible sections, change password
- Photo upload with drag & drop support
=======
# Employee-Management-System
>>>>>>> 07d056d3df3cab082225548539ab483a84dabfc8
