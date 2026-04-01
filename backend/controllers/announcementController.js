const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            // Show global announcements OR announcements targeting this user's department/role
            query = {
                $or: [
                    { targetDepartment: null, targetRole: null },
                    { targetDepartment: req.user.department },
                    { targetRole: req.user.role }
                ]
            };
        }
        const announcements = await Announcement.find(query).populate('createdBy', 'name').sort('-createdAt');
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin/Manager
const createAnnouncement = async (req, res) => {
    try {
        const { title, description, targetDepartment, targetRole, type, scheduledDate } = req.body;

        const announcement = await Announcement.create({
            title,
            description,
            createdBy: req.user._id,
            targetDepartment: targetDepartment || null,
            targetRole: targetRole || null,
            type: type || 'Info',
            scheduledDate: scheduledDate || new Date()
        });

        // Create a matching global / department notification
        await Notification.create({
            title: `📢 ${title}`,
            message: description,
            type: 'Announcement',
            recipient: null,  // null = visible to all / global
            department: targetDepartment || null,
            link: '/dashboard'
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

        // Allow creator or Admin to delete
        if (req.user.role === 'Admin' || req.user._id.toString() === announcement.createdBy.toString()) {
            await announcement.deleteOne();
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(403).json({ message: 'Not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement
};
