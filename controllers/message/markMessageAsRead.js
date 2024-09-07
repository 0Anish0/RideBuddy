// const Message = require('../../models/Message');

// const markMessageAsRead = async (req, res) => {
//     try {
//         const { messageId } = req.params;

//         const updatedMessage = await Message.findByIdAndUpdate(
//             messageId,
//             { isRead: true },
//             { new: true }
//         );

//         res.json(updatedMessage);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// };

// module.exports = markMessageAsRead;










const Message = require('../../models/Message');

const markMessagesAsRead = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        // Update all unread messages from sender to receiver
        const updatedMessages = await Message.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            { $set: { isRead: true } }, // Set all unread messages to read
            { new: true }
        );

        res.json({ success: true, updatedMessages });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = markMessagesAsRead;
