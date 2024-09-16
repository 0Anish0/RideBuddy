const RequestBooking = require('../../models/RequestBooking');
const RideOffer = require('../../models/RideOffer');
const Profile = require('../../models/Profile');

const getOfferedRideById = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const userProfile = await Profile.findById(userId);
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch booked rides (where user is a passenger)
        const bookedRides = await RequestBooking.find({ userProfile: userId })
            .populate({
                path: 'ride',  // Assuming 'ride' is a reference to RideOffer
                populate: { path: 'driver', select: 'name' }
            })
            .populate('userProfile', 'name');  // Assuming 'userProfile' is referencing the Profile schema

        // Fetch offered rides (where user is the driver)
        const offeredRides = await RideOffer.find({ driver: userId })
            .populate('driver', 'name');  // Assuming 'driver' references the Profile schema

        return res.status(200).json({
            success: true,
            message: 'Rides fetched successfully',
            data: {
                userProfile,
                bookedRides,
                offeredRides
            }
        });
    } catch (error) {
        console.error('Error fetching rides:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching rides',
            error: error.message
        });
    }
};

module.exports = {
    getOfferedRideById
};
