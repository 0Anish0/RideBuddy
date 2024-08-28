const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    rewardsPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    carbonEmissionPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    totalRideOffers: [{
        type: Schema.Types.ObjectId,
        ref: 'OfferRide'
    }],
    totalRidesBooked: [{
        type: Schema.Types.ObjectId,
        ref: 'BookRide'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

WalletSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Wallet', WalletSchema);