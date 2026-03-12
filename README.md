# 🏢 HRMS ERP — Human Resource Management System

A full-stack HRMS ERP built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
  - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
  - [Option B: Render (Backend) + Netlify (Frontend)](#option-b-render-backend--netlify-frontend)
  - [Option C: Manual VPS / Ubuntu Server](#option-c-manual-vps--ubuntu-server)
- [First-time Admin Setup](#first-time-admin-setup)
- [API Overview](#api-overview)

---

## 🛠 Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 19, Vite 7, TailwindCSS, Framer Motion |
| Backend   | Node.js, Express 5, Socket.io               |
| Database  | MongoDB (Mongoose)                          |
| Auth      | JWT (jsonwebtoken) + bcryptjs               |
| File Upload | Multer (local disk, max 5MB)              |
| Realtime  | Socket.io (team chat)                       |

---

## 📁 Project Structure

```
hrms-erp/
├── backend/                  # Express API
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── uploads/              # User-uploaded files
│   ├── server.js             # Entry point
│   ├── seed.js               # Admin seeder
│   ├── .env.example          # Required env vars
│   └── Dockerfile
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Route pages
│   │   ├── components/       # Reusable UI
│   │   └── services/api.js   # Axios instance
│   ├── .env.example
│   ├── nginx.conf            # Production nginx config
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- MongoDB running locally (`mongod`)

### 1. Clone and setup

```bash
git clone <your-repo-url>
cd hrms-erp
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # Edit with your values
npm install
npm run dev                 # Starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env        # Edit VITE_API_URL if needed
npm install
npm run dev                 # Starts on http://localhost:5173
```

### 4. Seed the first admin

```bash
cd backend
npm run seed
# Default: admin@hrms.com / Admin@123!
# ⚠️ Change the password immediately after first login
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable        | Required | Description                                                  |
|-----------------|----------|--------------------------------------------------------------|
| `PORT`          | No       | Server port (default: 5000)                                  |
| `NODE_ENV`      | No       | `development` or `production`                                |
| `MONGO_URI`     | **Yes**  | MongoDB connection string                                    |
| `JWT_SECRET`    | **Yes**  | Secret key for signing JWTs — use a strong random value      |
| `CLIENT_URL`    | **Yes**  | Comma-separated list of allowed frontend origins (no slash)  |
| `ADMIN_EMAIL`   | No       | Seeder admin email (default: admin@hrms.com)                 |
| `ADMIN_PASSWORD`| No       | Seeder admin password (default: Admin@123!)                  |

### Frontend (`frontend/.env`)

| Variable          | Required | Description                              |
|-------------------|----------|------------------------------------------|
| `VITE_API_URL`    | **Yes**  | Backend API URL including `/api` suffix  |
| `VITE_SOCKET_URL` | **Yes**  | Backend base URL (no `/api` suffix)      |

---

## 🌐 Production Deployment

---

### Option A: Docker Compose (Recommended)

Runs everything (MongoDB + backend + frontend/nginx) in Docker.

```bash
# 1. Configure backend env
cp backend/.env.example backend/.env
# Edit backend/.env: set MONGO_URI, JWT_SECRET, CLIENT_URL

# 2. Build and start
docker-compose up -d --build

# 3. Seed the admin user
docker exec hrms_backend node seed.js

# 4. Visit http://your-server-ip
```

To update after code changes:
```bash
docker-compose down
docker-compose up -d --build
```

---

### Option B: Render (Backend) + Netlify (Frontend)

#### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo, set **Root Directory** to `backend`
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
6. Add environment variables in Render dashboard:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → strong random secret
   - `CLIENT_URL` → your Netlify frontend URL (e.g., `https://hrms-app.netlify.app`)
   - `NODE_ENV` → `production`
7. After deploy, run the seeder: Render Dashboard → **Shell** tab → `node seed.js`

#### Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from Git
2. Set **Base directory** to `frontend`
3. **Build command:** `npm run build`
4. **Publish directory:** `frontend/dist`
5. Add environment variables:
   - `VITE_API_URL` → `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL` → `https://your-backend.onrender.com`
6. Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```
   *(This is already handled by `nginx.conf` in Docker but needed for Netlify)*

---

### Option C: Manual VPS / Ubuntu Server

```bash
# ── Install Node 20 ──────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# ── Install PM2 ──────────────────────────────────────────────────────
sudo npm install -g pm2

# ── Backend ──────────────────────────────────────────────────────────
cd backend
cp .env.example .env && nano .env   # set all vars
npm install --omit=dev
npm run seed
pm2 start server.js --name hrms-backend
pm2 save && pm2 startup

# ── Frontend ─────────────────────────────────────────────────────────
cd ../frontend
cp .env.example .env && nano .env   # set VITE_API_URL
npm install
npm run build
# Copy dist/ to your nginx webroot or use serve:
sudo npm install -g serve
pm2 start "serve -s dist -l 3000" --name hrms-frontend
```

Configure nginx as a reverse proxy pointing `yourdomain.com` → `localhost:3000` and `/api` → `localhost:5000`.

---

## 👤 First-time Admin Setup

After deployment, run the seeder once to create the admin account:

```bash
node seed.js
```

Default credentials (override with env vars):
- **Email:** `admin@hrms.com`
- **Password:** `Admin@123!`

> ⚠️ **Change the password immediately after first login!**

---

## 📡 API Overview

| Prefix                | Description            |
|-----------------------|------------------------|
| `POST /api/auth/login`| Login                  |
| `GET  /api/users`     | All users (Admin)      |
| `POST /api/users`     | Create user (Admin)    |
| `GET  /api/attendance`| Attendance records     |
| `POST /api/leaves`    | Apply for leave        |
| `GET  /api/tasks`     | Task management        |
| `GET  /api/payroll`   | Payroll & payslips     |
| `GET  /api/reports`   | PDF report generation  |
| `POST /api/upload`    | File upload (5MB max)  |
| `GET  /api/holidays`  | Holiday calendar       |
| `GET  /api/announcements` | Announcements      |

---

## 📝 Development Notes

- **File uploads** are stored locally in `backend/uploads/`. For production at scale, migrate to **AWS S3** or **Cloudinary**.
- **JWT tokens** expire in 30 days. Tune in `authController.js`.
- Socket.io chat is **in-memory** — messages are not persisted across reconnects unless saved to the `Message` model.
