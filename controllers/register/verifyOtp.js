const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const NewUser = require('../../models/NewUser');
const sendEmail = require('../../config/nodemailer');

exports.verifyOtp = async (req, res) => {
    const { mobile, otp, emailOtp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }

    try {
        const user = await NewUser.findOne({ mobile });

        if (!user || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const otpMatch = await bcrypt.compare(otp, user.otp);

        if (!otpMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.isMobileVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        if (emailOtp) {
            if (!user.emailOtp || user.emailOtpExpiry < Date.now()) {
                return res.status(400).json({ message: 'Invalid or expired email OTP' });
            }

            const emailOtpMatch = await bcrypt.compare(emailOtp, user.emailOtp);
            if (emailOtpMatch) {
                user.isEmailVerified = true;
                user.emailOtp = null;
                user.emailOtpExpiry = null;

                try {
                    await sendEmail(user.email, 'OTP Verified', `Your OTP for RideBuddy has been successfully verified.`);
                    console.log(`OTP verification email sent to ${user.email}`);
                } catch (error) {
                    console.error('Error sending OTP verification email:', error);
                }
            } else {
                return res.status(400).json({ message: 'Invalid email OTP' });
            }
        }

        const newUser = new User({
            mobile: user.mobile,
            email: user.email,
            isMobileVerified: user.isMobileVerified,
            isEmailVerified: user.isEmailVerified
        });

        await newUser.save();
        await user.deleteOne();

        const token = jwt.sign({ id: newUser._id, mobile: newUser.mobile }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.status(200).json({
            message: 'OTP verified successfully. You can now create your profile.',
            token: token,
            isMobileVerified: newUser.isMobileVerified,
            isEmailVerified: newUser.isEmailVerified
        });
    } catch (error) {
        console.error('Error during OTP verification process:', error);
        res.status(500).json({ message: 'An unexpected error occurred', error: error.message || error });
    }
};