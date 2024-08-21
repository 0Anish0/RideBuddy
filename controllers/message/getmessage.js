const Message = require('../../models/Message')

exports.getMessageById = async (req, res) => {
    const userId = req.user.id;
    const senderId = req.params.id;

    try {

        const messages = await Message.find({
            $and: [
                { senderId: senderId },
                { receiverId: userId }
            ]
        }).sort('timestamp');
        res.status(200).json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};