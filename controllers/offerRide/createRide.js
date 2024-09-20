const Ride = require('../../models/RideOffer');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

exports.createRide = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const driver = await Profile.findOne({ userId: user._id });

        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver profile not found' });
        }

        const {
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoint,
            destinationName,
            destinationPoint,
            routes,
            tripDistance,
            tripDuration,
            time,
            date,
            seatsOffered,
            noOfSeat,
            pricePerSeat,
            status,
            vehicle,
            recurringRide,
            selectedDays,
            gender,
        } = req.body;

        if (!sourceName || !sourcePoint || !destinationName || !destinationPoint || !routes || !tripDistance || !tripDuration || !time || !date || !seatsOffered || !pricePerSeat || !vehicle) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields" });
        }

        const newRide = new Ride({
            driver: driver._id,
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoint,
            destinationName,
            destinationPoint,
            routes,
            vehicle,
            tripDistance,
            tripDuration,
            time,
            date,
            seatsOffered,
            noOfSeat,
            pricePerSeat,
            status: status || 'pending',
            recurringRide,
            selectedDays,
            gender
        });

        await newRide.save();

        res.status(201).json({ success: true, message: 'Ride created successfully', ride: newRide });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create ride', error: error.message });
    }
};