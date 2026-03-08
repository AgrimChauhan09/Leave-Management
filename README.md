# Leave Management (Vue + Node + MongoDB Atlas)

live Link:-https://leave-management-3jv9tbxtn-agrimchauhan7500-6820s-projects.vercel.app/
Basic web app where:

- **Employees**: sign up, log in, apply for leave, and track status (Pending/Approved/Rejected).
- **Employers**: sign up, log in, view all leave requests, approve/reject.

## Tech stack

- **Frontend**: Vue 3 (Vite) + Tailwind CSS
- **Backend**: Node.js + Express (REST)
- **DB**: MongoDB Atlas (Mongoose)
- **Auth**: JWT (Bearer token) + role-based access control

## Folder structure

- `backend/`: Express API
- `frontend/`: Vue app

## Local setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set these variables in `backend/.env`:

- `MONGODB_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: long random string
- `CLIENT_ORIGIN`: `http://localhost:5173`

API runs on `http://localhost:8080`.

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## How it works (high level)

- `POST /api/auth/signup` and `POST /api/auth/login` return `{ token, user }`.
- Frontend stores the JWT in `localStorage` and sends it as `Authorization: Bearer <token>`.
- **Employee**
  - `POST /api/leaves` creates a leave request.
  - `GET /api/leaves/mine` lists the employee’s own requests.
- **Employer**
  - `GET /api/leaves` lists all leave requests (includes employee info).
  - `PATCH /api/leaves/:id/status` approves/rejects.


