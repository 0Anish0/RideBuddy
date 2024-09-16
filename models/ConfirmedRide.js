const mongoose = require('mongoose');

const confirmedRideSchema = new mongoose.Schema({
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConfirmedRide', // Refers to itself (the confirmed ride)
        required: true
    },
    offeredRideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideOffer', // Refers to the offered ride
        required: true
    },
    passengers: [{
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        bookRideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookRide', // Refers to each passenger's booking
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'started', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const ConfirmedRide = mongoose.model('ConfirmedRide', confirmedRideSchema);
module.exports = ConfirmedRide;