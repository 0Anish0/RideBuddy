// const BookRide = require('../../models/BookRide');
// const Ride = require('../../models/RideOffer');
// const Profile = require('../../models/Profile');

// const getBookedRideById = async (req, res) => {
//     try {
//         const bookedRide = await BookRide.findById(req.params.id)
//             .populate({
//                 path: 'ride',
//                 model: Ride,
//             })
//             .populate({
//                 path: 'user',
//                 model: Profile,
//             })
//             .exec();

//         if (!bookedRide) {
//             return res.status(404).json({ message: 'Booked ride not found' });
//         }

//         res.status(200).json(bookedRide);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     getBookedRideById,
// };












const mongoose = require('mongoose');
const RequestBooking = require('../../models/RequestBooking');
const RideOffer = require('../../models/RideOffer');
const ConfirmedRide = require('../../models/ConfirmedRide');  // Fix the model name if necessary
const Profile = require('../../models/Profile');

// Fetch rides by profile IDconst getRidesByProfileId = async (req, res) => {
    const getRidesByProfileId = async (req, res) => {
        try {
            console.log("get test");
    
            // Extract the 'id' field from req.params
            const profileId = req.params.id;
            console.log("profileId", profileId);
    
            // Validate if profileId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(profileId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Profile ID format'
                });
            }
    
            // Check if the profile exists
            const userProfile = await Profile.findById(profileId);
            if (!userProfile) {
                return res.status(404).json({
                    success: false,
                    message: 'User profile not found'
                });
            }
    
            // Fetch offered rides (where the profile is the driver)
            const offeredRides = await RideOffer.find({ driver: profileId })
                .populate('driver', 'name')
                .exec();
    
            const allBooking = await RequestBooking.find();
            console.log("test", allBooking);
    
            // Fetch booked rides (where the profile is a passenger)
            const bookedRides = await RequestBooking.find({ userProfile: profileId })
                .populate({
                    path: 'offerRide',  // This references the RideOffer in RequestBooking
                    model: RideOffer,    // Ensure correct model is used
                    populate: { path: 'driver', select: 'name' },  // Populate driver details
                })
                .exec();
    
            const allRides = await ConfirmedRide.find();
            console.log(allRides);
    
            // Fetch confirmed rides (where the profile is a driver or passenger)
            const confirmedRides = await ConfirmedRide.find({
                $or: [
                    { 'passengers.profileId': profileId }, // Profile is a passenger
                    { 'offeredRideId': profileId }          // Profile is the driver
                ]
            })
                .populate({
                    path: 'offeredRideId',
                    model: RideOffer,
                    populate: { path: 'driver', select: 'name' }  // Populate driver details
                })
                .populate('passengers.profileId', 'name')  // Populate passenger details
                .exec();
    
            // Return all the rides data along with the user profile
            return res.status(200).json({
                success: true,
                message: 'Rides fetched successfully',
                data: {
                    userProfile,     // Return the user profile
                    offeredRides,    // Return offered rides
                    bookedRides,     // Return booked rides (request bookings)
                    confirmedRides,  // Return confirmed rides
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
        getRidesByProfileId,
    };
    