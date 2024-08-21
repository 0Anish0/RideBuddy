const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    addStop: {
        type: String
    },
    destination: {
        type: String,
        required: true
    },
    vehical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    routes: {
        type: String,
        required: true
    },
    tripDistance: {
        type: String,
        required: true
    },
    tripDuration: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    noOfSeat: {
        type: String,
        required: true
    },
    pricePerSeat: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'started', 'arrived', 'cancelled', 'completed'],
        default: 'pending'
    }
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;