const Message = require('../../models/Message');
const Profile = require('../../models/Profile');

exports.getMessageById = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        const senderId = req.params.id;
        const messages = await Message.find({
            $and: [
                { senderId: senderId },
                { receiverId: profile._id }
            ]
        }).sort('timestamp');
        res.status(200).json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};