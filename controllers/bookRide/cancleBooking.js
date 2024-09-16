const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Wallet = require('./models/Wallet');
const RideOffer = require('./models/RideOffer');
const ConfirmedRide = require('./models/ConfirmedRide');
const RequestBooking = require('./models/RequestBooking');

// Cancelling a Confirmed Ride
exports.cancelConfirmedRide = async (req, res) => {
    const { confirmedRideId } = req.params;
    const { userId } = req.user; // Assuming authentication middleware adds user to req

    try {
        const confirmedRide = await ConfirmedRide.findById(confirmedRideId).populate('rideId');
        if (!confirmedRide) {
            return res.status(404).send('Confirmed ride not found.');
        }

        // Check if the cancellation is at least 15 minutes before the pickup time
        const timeDiff = new Date(confirmedRide.rideId.pickupTime) - new Date();
        if (timeDiff < 900000) { // less than 15 minutes in milliseconds
            return res.status(400).send('Cancellation must be made at least 15 minutes before pickup time.');
        }

        // Calculate refund and penalties
        const totalCost = confirmedRide.rideId.paymentAmount;
        const penalty = totalCost * 0.15;
        const refund = totalCost - penalty;
        const driverShare = penalty * 0.10 / 0.15;
        const adminShare = penalty * 0.05 / 0.15;

        // Update wallets
        const userWallet = await Wallet.findOne({ userId });
        const driverWallet = await Wallet.findOne({ userId: confirmedRide.rideId.driver });
        userWallet.balance += refund;
        driverWallet.balance += driverShare;
        // Assume adminWallet is managed separately

        await userWallet.save();
        await driverWallet.save();

        // Update confirmed ride status
        confirmedRide.status = 'cancelled';
        await confirmedRide.save();

        res.send('Ride cancelled successfully. Refund has been processed.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Cancelling a Request Booking
exports.cancelRequestBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await RequestBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).send('Booking not found.');
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.send('Booking cancelled successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
