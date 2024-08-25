const bcrypt = require('bcrypt');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }
    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const otpMatch = bcrypt.compare(otp, user.otp);
        if (!otpMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        else if (otpMatch && user.otpExpiry > Date.now()) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            const token = jwt.sign({ mobile: user.mobile, id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
            res.status(200).json({ message: 'OTP verified successfully', user, token });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
};