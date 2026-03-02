const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io for Real-time chat
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.io middleware and events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Basic Route
app.get('/', (req, res) => res.send('HRMS API is running'));

const path = require('path');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
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

// Serve static uploads
const __dirname_resolved = path.resolve();
app.use('/uploads', express.static(path.join(__dirname_resolved, '/uploads')));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
