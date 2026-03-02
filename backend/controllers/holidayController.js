const Holiday = require('../models/Holiday');

// @desc    Get all holidays
// @route   GET /api/holidays
// @access  Private
const getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find({}).sort('date');
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a holiday
// @route   POST /api/holidays
// @access  Private/Admin
const createHoliday = async (req, res) => {
    try {
        const { name, date, type, description } = req.body;
        const holiday = await Holiday.create({ name, date, type, description });
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a holiday
// @route   DELETE /api/holidays/:id
// @access  Private/Admin
const deleteHoliday = async (req, res) => {
    try {
        await Holiday.findByIdAndDelete(req.params.id);
        res.json({ message: 'Holiday deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getHolidays, createHoliday, deleteHoliday };
