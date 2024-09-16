require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');

const Register = require('./routes/register');
const Login = require('./routes/login');
const OfferRide = require('./routes/offerRide');
const BookRide = require('./routes/bookRide');
const Wallet = require('./routes/wallet');
const Vehical = require('./routes/vehicle');
const Emergency = require('./routes/emergencyContacts');
const Verification = require('./routes/verification');
const Message = require('./routes/message');
const Prompt = require('./routes/prompt');
const Intrest = require('./routes/intrest');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Routes
app.use('/api', OfferRide);
app.use('/api', Intrest);
app.use('/api', Prompt);
app.use('/api', Register);
app.use('/api', Login);

app.use('/api', BookRide);
app.use('/api', Wallet);
app.use('/api', Vehical);
app.use('/api', Emergency);
app.use('/api', Verification);
app.use('/api', Message);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});










// const RequestBooking = require('../../models/RequestBooking');
// const RideOffer = require('../../models/RideOffer');
// const ConfirmedRide = require('../../models/ConfirmedRide');
// const Profile = require('../../models/Profile');

// const getRidesByUserId = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User ID is required'
//             });
//         }

//         // Fetch the user profile
//         const userProfile = await Profile.findById(userId, 'name age gender interests');  // Only include required fields

//         if (!userProfile) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found'
//             });
//         }

//         // Fetch booked rides (where the user is a passenger)
//         const bookedRides = await RequestBooking.find({ userProfile: userId })
//             .populate({
//                 path: 'offerRide',
//                 model: 'RideOffer',
//                 select: 'pickupTime tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat',
//                 populate: { path: 'driver', select: 'name', model: 'Profile' }  // Populate the driver field
//             })
//             .populate('userProfile', 'name');

//         // Fetch offered rides (where the user is the driver)
//         const offeredRides = await RideOffer.find({ driver: userId }, 'pickupTime tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat')
//             .populate({
//                 path: 'driver', 
//                 select: 'name',
//                 model: 'Profile' // Populate the driver from Profile model
//             });

//         // Fetch confirmed rides (either as passenger or driver)
//         const confirmedRides = await ConfirmedRide.find({
//             $or: [
//                 { 'passengers.profileId': userId },  // User is a passenger
//                 { offeredRideId: { $in: offeredRides.map(ride => ride._id) } }  // User is the driver
//             ]
//         })
//         .populate({
//             path: 'offeredRideId',
//             model: 'RideOffer',
//             select: 'pickupTime tripDuration sourceName destinationName seatsOffered tripDistance vehicle.brand_model pricePerSeat',
//             populate: { path: 'driver', select: 'name', model: 'Profile' }  // Populate the driver field from Profile
//         })
//         .populate({
//             path: 'passengers.profileId',
//             select: 'name',
//             model: 'Profile'
//         });

//         // Respond with all rides data
//         return res.status(200).json({
//             success: true,
//             message: 'Rides fetched successfully',
//             data: {
//                 userProfile,  // The user profile
//                 bookedRides,  // Rides the user has booked
//                 offeredRides, // Rides the user has offered as a driver
//                 confirmedRides // Rides the user is involved in (as driver or passenger)
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching rides:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'An error occurred while fetching rides',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     getRidesByUserId
// };
