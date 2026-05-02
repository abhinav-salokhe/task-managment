# Team Task Manager (MERN)

Full-stack Team Task Manager with JWT auth, role-based access, project management, task management, and dashboard analytics.

## Tech Stack

- MongoDB + Mongoose
- Express.js (MVC)
- React + Vite
- Node.js
- Tailwind CSS

## Run Locally

### 1) Backend setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

### 2) Frontend setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000` and frontend on `http://localhost:5173`.

## Core Features

- JWT auth with signup/login and bcrypt password hashing
- Role-based permissions (`Admin`, `Member`)
- Admin: create projects, add/remove members, assign tasks
- Member: view assigned projects and update own task statuses
- Dashboard metrics: total tasks, status breakdown, overdue count, project filter
