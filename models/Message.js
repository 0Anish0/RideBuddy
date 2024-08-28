const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Profile'
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        ref: 'Profile'
    },
    message: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Message', messageSchema);