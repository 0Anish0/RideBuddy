const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    sourceName: {
        type: String,
        required: true
    },
    sourcePoint: {
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true
        }
    },
    addStopName: {
        type: String
    },
    addStopPoint: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    destinationName: {
        type: String,
        required: true
    },
    destinationPoint: {
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true
        }
    },
    vehicle: {
        brand_model: {
            type: String,
            required: true
        },
        brand_name: {
            type: String,
            required: true
        },
        fuel_type: {
            type: String,
            required: true
        },
        license_plate: {
            type: String,
            required: true
        },
        owner_name: {
            type: String,
            required: true
        },
        rc_status: {
            type: String,
            required: true
        },
        seating_capacity: {
            type: String,
            required: true
        },
        vehicle_color: {
            type: String,
            required: true
        },
        vehicle_image: {
            type: String,
            required: true
        }
    },
    routes: {
        type: Array,
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
    time: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    seatsOffered: {
        type: Number,
        required: true
    },
    noOfSeat: {
        type: string,
    },
    pricePerSeat: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'started', 'arrived', 'cancelled', 'completed'],
        default: 'pending'
    },
    recurringRide: {
        type: Boolean,
        default: false
    },
    selectedDays: {
        type: [String],
    },
    preferences: {
        type: [[String]],
        default: []
    }
});

const Ride = mongoose.model('RideOffer', RideSchema);

module.exports = Ride;