require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const NewUser = require('../../models/NewUser');
const generateOTP = require('../../utils/generateOTP');
const sendOtp = require('../../utils/sendOtp');
const sendEmail = require('../../config/nodemailer');

const OTP_HASH_SALT_ROUNDS = 10;

exports.sendOtp = async (req, res) => {
    const { mobile, email } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const existingOtp = await NewUser.findOne({ mobile });

    if (existingOtp) {
        await NewUser.deleteOne({ mobile });
        console.log(`Old OTP data for mobile number ${mobile} deleted.`);
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        let user = await User.findOne({ mobile });

        if (user && user.isMobileVerified === true) {
            return res.status(400).json({ message: 'You already have an account. Please login.' });
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000;
        const hashedOtp = await bcrypt.hash(otp, OTP_HASH_SALT_ROUNDS);

        let userData = {
            mobile,
            otp: hashedOtp,
            otpExpiry
        };

        if (email) {
            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'Email is already in use. Please login.' });
            }
            const emailOtp = generateOTP();
            const emailOtpExpiry = Date.now() + 5 * 60 * 1000;
            const hashedEmailOtp = await bcrypt.hash(emailOtp, OTP_HASH_SALT_ROUNDS);

            userData.email = email;
            userData.emailOtp = hashedEmailOtp;
            userData.emailOtpExpiry = emailOtpExpiry;

            try {
                await sendEmail(email, 'Your RideBuddy OTP', `Your OTP for RideBuddy is ${emailOtp}. Please do not share it with anyone.`);
                console.log(`OTP ${emailOtp} sent to email ${email}`);
            } catch (error) {
                console.error('Error sending email OTP:', error);
                return res.status(500).json({ message: 'Failed to send OTP to email' });
            }
        }

        user = new NewUser(userData);

        await user.save({ validateBeforeSave: false });

        const maskedMobile = mobile.slice(-4).padStart(mobile.length, '*');
        const maskedEmail = email ? `${email.charAt(0)}${'*'.repeat(email.length - 11)}${email.slice(-11)}` : '';

        try {
            await sendOtp({ mobile, otp });
            res.status(200).json({ message: `OTP sent to ${maskedMobile}${email ? ` and ${maskedEmail}` : ''}` });
        } catch (error) {
            console.error('Error sending OTP via SMS:', error);
            res.status(500).json({ message: 'Error sending OTP via SMS', error: error.message || error });
        }
    } catch (error) {
        console.error('Error during OTP process:', error);
        res.status(500).json({ message: 'An unexpected error occurred', error: error.message || error });
    }
};