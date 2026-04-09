const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');

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

        // Fan-out individual notifications to each targeted user
        // Build user query based on targetDepartment and/or targetRole
        const userQuery = { status: 'Active' };
        if (targetDepartment) userQuery.department = targetDepartment;
        if (targetRole) userQuery.role = targetRole;

        const targetUsers = await User.find(userQuery).select('_id');
        if (targetUsers.length > 0) {
            const notifDocs = targetUsers.map(u => ({
                title: `📢 ${title}`,
                message: description,
                type: 'Announcement',
                recipient: u._id,
                link: '/announcements'
            }));
            await Notification.insertMany(notifDocs);
        }

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
