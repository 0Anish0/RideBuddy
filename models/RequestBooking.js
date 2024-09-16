const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestBookingSchema = new Schema({
    pickupName: {
        type: String,
        required: true,
    },
    dropoffName: {
        type: String,
        required: true,
    },
    pickupPoint: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        }
    },
    dropoffPoint: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        }
    },
    userProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    offerRide: {
        type: Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
    },
    noOfSeatsBooked: {
        type: Number,
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
});

module.exports = mongoose.model('RequestBooking', RequestBookingSchema);