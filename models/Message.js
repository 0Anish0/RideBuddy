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
    read: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Message', messageSchema);