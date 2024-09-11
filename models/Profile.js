const mongoose = require('mongoose');

function charLimit(val) {
    return val.length <= 60;
}

function arrayLimit(val) {
    return val.length <= 5;
}

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profilePicture: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        validate: [charLimit, '{PATH} exceeds the 60-character limit']
    },
    interests: {
        type: [String]
    },
    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    },
    prompts: {
        type: [String]
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'blocked'],
        default: 'active'
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);