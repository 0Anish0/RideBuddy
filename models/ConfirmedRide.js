// const mongoose = require('mongoose');

// const confirmedRideSchema = new mongoose.Schema({
//     offeredRideId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'RideOffer', // Refers to the offered ride
//         required: true
//     },
//     passengers: [{
//         profileId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Profile',
//             required: true
//         },
//         bookRideId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'RequestBooking', // Refers to each passenger's booking
//             required: true
//         }
//     }],
//     status: {
//         type: String,
//         enum: ['pending', 'started', 'completed', 'cancelled'],
//         default: 'pending'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const ConfirmedRide = mongoose.model('ConfirmedRide', confirmedRideSchema);
// module.exports = ConfirmedRide;
















const mongoose = require('mongoose');

const confirmedRideSchema = new mongoose.Schema({
    offeredRideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideOffer',
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
            ref: 'RequestBooking',
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for dynamic status
confirmedRideSchema.virtual('rideStatus').get(function () {
    if (!this.offeredRideId || !this.offeredRideId.pickupTime) {
        return 'Status unavailable'; // Handle unpopulated offeredRideId or missing pickup time
    }

    const now = new Date();
    const pickupTime = new Date(this.offeredRideId.pickupTime);

    if (pickupTime < now) {
        return 'recent';
    } else if (pickupTime.toDateString() === now.toDateString()) {
        return now < pickupTime ? 'upcoming' : 'current';
    } else {
        return 'upcoming';
    }
});

const ConfirmedRide = mongoose.model('ConfirmedRide', confirmedRideSchema);
module.exports = ConfirmedRide;
