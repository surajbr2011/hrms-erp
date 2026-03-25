const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Admin creates a new user setup
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, designation, reportingManager, gender, phone, userId } = req.body;

        if (!name || !email || !password || !userId) {
            return res.status(400).json({ message: 'Name, email, password and User ID are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const idExists = await User.findOne({ userId });
        if (idExists) {
            return res.status(400).json({ message: 'User ID is already in use' });
        }

        const mongoose = require('mongoose');
        const getValidObjectId = (id) => id && mongoose.Types.ObjectId.isValid(id) ? id : undefined;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Employee',
            department: getValidObjectId(department),
            designation: getValidObjectId(designation),
            reportingManager: getValidObjectId(reportingManager),
            gender,
            phone,
            userId,
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin or Manager
const getUsers = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Employee') {
            query = { _id: req.user._id };
        } else if (req.user.role === 'Manager') {
            query = { $or: [{ role: 'Employee' }, { _id: req.user._id }] };
        }

        const users = await User.find(query)
            .populate('department', 'name')
            .populate('designation', 'title')
            .populate('reportingManager', 'name email')
            .select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('department', 'name')
            .populate('designation', 'title')
            .populate('reportingManager', 'name email')
            .select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const mongoose = require('mongoose');
        const getValidObjectId = (id) => id && mongoose.Types.ObjectId.isValid(id) ? id : undefined;

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            if (req.body.department !== undefined) user.department = getValidObjectId(req.body.department);
            if (req.body.designation !== undefined) user.designation = getValidObjectId(req.body.designation);
            if (req.body.reportingManager !== undefined) user.reportingManager = getValidObjectId(req.body.reportingManager);
            user.status = req.body.status || user.status;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
