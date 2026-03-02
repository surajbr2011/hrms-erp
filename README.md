# Trinix IT Solution Pvt.Ltd - Enterprise Role-Based HRMS Web Application

A full-stack modern Human Resource Management System with a dark glassmorphism theme, built on the MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Key Features

- **Role-Based Access Control**: Employee, Manager, and Admin dashboards.
- **Dark Glassmorphism UI**: Beautiful, fully responsive design using TailwindCSS & Framer Motion.
- **Attendance & Time Tracking**: Live digital clock, check-in widget, and break tracking logic.
- **Live Team Chat**: Real-time websocket messaging with Socket.io.
- **HR Tools**: Payroll pages, Leave management, Team directory, and interactive settings.

## 🛠 Tech Stack

**Frontend:** React (Vite), Tailwind CSS v3, Framer Motion, Axios, React Router, Socket.io-client, Lucide-React
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Socket.io, bcryptjs, cors

## 🚀 Local Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
# Rename .env.example to .env and configure your variables
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`.

## 🌐 Deployment Instructions

### Deploying the Backend (Render)

1. Create an account on [Render.com](https://render.com/).
2. Connect your Git repository.
3. Click "New Web Service", select your repo.
4. Set the Root Directory to `backend/`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add Environment Variables in Render (`MONGO_URI`, `JWT_SECRET`, etc.).
8. Click Create! Update your frontend's `SOCKET_URL` and API base URLs with the new Render URL.

### Deploying the Frontend (Hostinger/Netlify/Vercel)

1. In the `frontend` directory, ensure all your API URLs point to the production backend.
2. Run `npm run build`. This generates a `dist/` folder.
3. If using **Hostinger**:
   - Go to hPanel > File Manager for your domain.
   - Upload the contents of the `dist/` folder to the `public_html` directory.
   - For React Router to work, ensure you include an `.htaccess` file if needed, routing all requests to `index.html`.
4. If using **Netlify/Vercel**, just connect your repository and set the root directory to `frontend/`, build command `npm run build`, output directory `dist/`.

## 📂 Project Structure

- `frontend/src/pages/` - Dashboard, Leaves, Team, Chat...
- `frontend/src/components/` - Sidebar, Header, ProtectedRoute...
- `frontend/src/context/` - Auth Context & Data bridging
- `backend/models/` - Mongoose Schemas (User, Leave, Task, Attendance...)
- `backend/routes/` - Express Routes mapped to Auth, Leaves, Attendance...
- `backend/controllers/` - Route logic and middleware handlers...

Enjoy your new beautiful enterprise suite!
