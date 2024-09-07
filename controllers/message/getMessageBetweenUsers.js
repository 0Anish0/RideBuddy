const Message = require('../../models/Message');

const getMessagesBetweenProfiles = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
        .sort('timestamp')
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture');

        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = getMessagesBetweenProfiles;