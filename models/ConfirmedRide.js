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
            ref: 'RequestBooking', // Refers to each passenger's booking
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

// Adding an instance method
confirmedRideSchema.methods.calculateStatus = async function() {
    const now = new Date();
    // Populate the offeredRideId if it's not already populated
    await this.populate('offeredRideId').execPopulate();

    if (!this.offeredRideId || !this.offeredRideId.pickupTime) {
        return 'No pickup time available';
    }
    const pickupTime = new Date(this.offeredRideId.pickupTime);

    if (pickupTime < now) {
        return 'Recent';
    } else if (pickupTime.toDateString() === now.toDateString()) {
        return now < pickupTime ? 'Upcoming' : 'Current';
    } else {
        return 'Upcoming';
    }
};

const ConfirmedRide = mongoose.model('ConfirmedRide', confirmedRideSchema);
module.exports = ConfirmedRide;
