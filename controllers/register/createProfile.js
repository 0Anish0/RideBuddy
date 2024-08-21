// controllers/createProfile.js
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// Create Profile
exports.createProfile = async (req, res) => {
    const { mobile, name, age, gender, interests } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isMobileVerified) {
        return res.status(400).json({ message: 'Mobile number not verified' });
    }

    // Create the profile associated with the user
    const profile = new Profile({
        userId: user._id,
        name,
        age,
        gender,
        interests
    });

    await profile.save();

    res.status(200).json({
        message: 'Profile created successfully',
        user: {
            id: user._id,
            mobile: user.mobile,
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            interests: profile.interests
        }
    });
};