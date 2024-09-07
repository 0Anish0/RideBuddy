const Message = require('../../models/Message');

const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        res.json(updatedMessage);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = markMessageAsRead;