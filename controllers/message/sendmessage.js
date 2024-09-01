const Message = require('../../models/Message');
const Profile = require('../../models/Profile');

exports.sendMessage = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Sender profile not found' });
        }
        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            return res.status(400).json({ success: false, message: 'Receiver ID and message are required' });
        }
        const receiverProfile = await Profile.findById(receiverId);
        if (!receiverProfile) {
            return res.status(404).json({ success: false, message: 'Receiver profile not found' });
        }
        const newMessage = new Message({
            senderId: profile._id,
            receiverId: receiverId,
            message: message,
        });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message sent successfully', newMessage });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};