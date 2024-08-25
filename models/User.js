const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        required: false,
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);