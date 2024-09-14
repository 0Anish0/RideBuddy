const BookRide = require('../../models/BookRide');  // Adjust path as necessary
const RideOffer = require('../../models/RideOffer');  // Adjust path as necessary
const Profile = require('../../models/Profile');  // Adjust path as necessary

const getOfferedRideById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate userId format (if necessary)
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const userProfile = await Profile.findById(userId);
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch Booked Rides by the user
        const bookedRides = await BookRide.find({ user: userId })
            .populate('ride')  // Populate ride details
            .populate('user', 'name');  // Optionally populate user details with only specific fields (like name)

        // Fetch Offered Rides by the user
        const offeredRides = await RideOffer.find({ driver: userId });

        // Send response back with both booked and offered rides data
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
