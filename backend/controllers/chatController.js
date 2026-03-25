const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find conversations where user is a participant OR it's a global group
        const conversations = await Conversation.find({
            $or: [
                { participants: req.user._id },
                { isGroup: true }
            ]
        }).populate('participants', 'name profilePicture email')
          .populate({ path: 'lastMessage', populate: { path: 'sender', select: 'name' } })
          .sort('-updatedAt');
          
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/:id/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        let conversation;
        if (['general', 'engineering', 'design', 'announcements'].includes(req.params.id)) {
            conversation = await Conversation.findOne({ groupName: req.params.id, isGroup: true });
        } else {
            // Check if it's direct message user id or conversation id
            conversation = await Conversation.findOne({
                $or: [
                    { _id: req.params.id?.length === 24 ? req.params.id : null },
                    { isGroup: false, participants: { $all: [req.user._id, req.params.id] } }
                ]
            });
        }

        if (!conversation) return res.json([]);

        const messages = await Message.find({ conversationId: conversation._id })
            .populate('sender', 'name profilePicture')
            .sort('createdAt');
            
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Direct Conversation or return existing
// @route   POST /api/chat/direct
// @access  Private
const createDirectConversation = async (req, res) => {
    try {
        const { userId } = req.body; // the other user

        // Check if one exists
        let conv = await Conversation.findOne({
            isGroup: false,
            participants: { $all: [req.user._id, userId] }
        }).populate('participants', 'name profilePicture');

        if (!conv) {
            conv = await Conversation.create({
                isGroup: false,
                participants: [req.user._id, userId]
            });
            conv = await conv.populate('participants', 'name profilePicture');
        }

        res.status(200).json(conv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send Message
// @route   POST /api/chat/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
    const { text, attachments } = req.body;
    try {
        let conversation;
        // if id is 'general' or similar, we might need to create the group conv on the fly if it doesn't exist.
        if (['general', 'engineering', 'design', 'announcements'].includes(req.params.id)) {
            conversation = await Conversation.findOne({ groupName: req.params.id, isGroup: true });
            if (!conversation) {
                conversation = await Conversation.create({ groupName: req.params.id, isGroup: true });
            }
        } else {
            conversation = await Conversation.findOne({
                $or: [
                    { _id: req.params.id?.length === 24 ? req.params.id : null },
                    { isGroup: false, participants: { $all: [req.user._id, req.params.id] } }
                ]
            });
            if (!conversation && req.params.id?.length === 24) {
                 // Might be a user ID to start a DM
                 conversation = await Conversation.create({
                     isGroup: false,
                     participants: [req.user._id, req.params.id]
                 });
            }
        }

        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        const message = await Message.create({
            conversationId: conversation._id,
            sender: req.user._id,
            text,
            attachments: attachments || []
        });

        // Update lastMessage
        conversation.lastMessage = message._id;
        await conversation.save();

        const populatedMessage = await message.populate('sender', 'name profilePicture');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getConversations, getMessages, createDirectConversation, sendMessage };
