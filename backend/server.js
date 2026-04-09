const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars first
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// ─── CORS ────────────────────────────────────────────────────────────────────
// Always include base origins, then merge any extras from CLIENT_URL env var
const BASE_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://spontaneous-cactus-3f64f7.netlify.app',
    'https://singular-eclair-169995.netlify.app',
    'http://13.232.14.120:5000'
];

const envOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
    : [];

const allowedOrigins = [...new Set([...BASE_ORIGINS, ...envOrigins])];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow ANY IP and origin to bypass CORS restrictions
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes


// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // Allow ANY origin for socket connections
            return callback(null, true);
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ─── Security headers (lightweight, no helmet dep required) ──────────────────
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ─── Socket.io Events ────────────────────────────────────────────────────────
const chatHistory = [];

io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
        socket.join(room);
        const history = chatHistory.filter(m => m.room === room);
        socket.emit('chat_history', history);
    });

    socket.on('send_message', (data) => {
        chatHistory.push(data);
        if (chatHistory.length > 2000) chatHistory.shift();
        // Emits to everyone else in the room
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        // cleanup if needed
    });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', message: 'HRMS API is running' }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/daily-reports', require('./routes/dailyReportRoutes'));
app.use('/api/holidays', require('./routes/holidayRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ─── Static Uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);
