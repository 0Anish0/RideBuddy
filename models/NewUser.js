const mongoose = require('mongoose');

const NewUserSchema = new mongoose.Schema({
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        required: false,
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    emailOtp: {
        type: String
    },
    emailOtpExpiry: {
        type: Date
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
module.exports = mongoose.model('NewUser', NewUserSchema);