const Task = require('../models/Task');
const TaskComment = require('../models/TaskComment');

// @desc    Get all tasks for a user or team
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let tasks;

        // Admin sees all, Manager sees assigned to them or by them or their department (simplified to all for now or scoped later), Employee sees own
        if (req.user.role === 'Admin') {
            tasks = await Task.find()
                .populate('assignedTo', 'name email profilePicture')
                .populate('assignedBy', 'name');
        } else {
            tasks = await Task.find({ $or: [{ assignedTo: req.user._id }, { assignedBy: req.user._id }] })
                .populate('assignedTo', 'name email profilePicture')
                .populate('assignedBy', 'name');
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin/Manager)
const createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate, priority } = req.body;

    try {
        const task = new Task({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            dueDate,
            priority
        });

        const createdTask = await task.save();

        // Optionally create Notification here

        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a task status or details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (req.user.role !== 'Admin' && req.user.role !== 'Manager' && req.user._id.toString() !== task.assignedTo.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }

            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.status = req.body.status || task.status;
            task.priority = req.body.priority || task.priority;
            task.dueDate = req.body.dueDate || task.dueDate;

            // Admin/Manager can reassign
            if (req.user.role === 'Admin' || req.user.role === 'Manager') {
                task.assignedTo = req.body.assignedTo || task.assignedTo;
            }

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin/Manager)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Only allow Creator, Admin, or Manager to delete
            if (req.user.role === 'Admin' || req.user._id.toString() === task.assignedBy.toString()) {
                await task.deleteOne();
                await TaskComment.deleteMany({ task: req.params.id });
                res.json({ message: 'Task removed' });
            } else {
                res.status(403).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
