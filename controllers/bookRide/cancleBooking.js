const Profile = require('../../models/Profile'); // Will now be used
const Wallet = require('../../models/Wallet');
const RideOffer = require('../../models/RideOffer');
const ConfirmedRide = require('../../models/ConfirmRide');
const RequestBooking = require('../../models/RequestBooking');

// Cancelling a Confirmed Ride
exports.cancelConfirmedRide = async (req, res) => {
    const { confirmedRideId } = req.params;
    const { userId } = req.user; // Assuming authentication middleware adds user to req

    try {
        // Find the confirmed ride
        const confirmedRide = await ConfirmedRide.findById(confirmedRideId).populate('rideId');
        if (!confirmedRide) {
            return res.status(404).send('Confirmed ride not found.');
        }

        // Find the corresponding ride offer
        const rideOffer = await RideOffer.findById(confirmedRide.offeredRideId);
        if (!rideOffer) {
            return res.status(404).send('Ride offer not found.');
        }

        // Check if the cancellation is at least 15 minutes before the pickup time
        const timeDiff = new Date(rideOffer.pickupTime) - new Date();
        if (timeDiff < 900000) { // less than 15 minutes in milliseconds
            return res.status(400).send('Cancellation must be made at least 15 minutes before pickup time.');
        }

        // Calculate refund and penalties
        const totalCost = rideOffer.pricePerSeat * confirmedRide.passengers.length;
        const penalty = totalCost * 0.15; // 15% penalty
        const refund = totalCost - penalty; // Refund after deducting the penalty
        const driverShare = penalty * 0.10; // 10% to the driver
        const adminShare = penalty * 0.05; // 5% to the admin

        // Retrieve wallets for the user (rider) and driver
        const userProfile = await Profile.findOne({ userId }).populate('wallet'); // Get the user's wallet from profile
        const driverProfile = await Profile.findById(rideOffer.driver).populate('wallet'); // Get driver's profile and wallet

        if (!userProfile || !userProfile.wallet || !driverProfile || !driverProfile.wallet) {
            return res.status(404).send('Profile or Wallet not found.');
        }

        // Update wallets
        const userWallet = await Wallet.findById(userProfile.wallet._id);
        const driverWallet = await Wallet.findById(driverProfile.wallet._id);

        if (!userWallet || !driverWallet) {
            return res.status(404).send('Wallets not found.');
        }

        // Refund the remaining amount to the user's wallet
        userWallet.balance += refund;

        // Add the driver’s share to the driver’s wallet
        driverWallet.balance += driverShare;

        // Assume adminWallet is managed separately (update it here as needed)

        await userWallet.save();
        await driverWallet.save();

        // Update confirmed ride status
        confirmedRide.status = 'cancelled';
        await confirmedRide.save();

        res.send({
            message: 'Ride cancelled successfully. Refund has been processed.',
            refundAmount: refund,
            driverShare,
            adminShare
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Cancelling a Request Booking
exports.cancelRequestBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the request booking by its ID
        const booking = await RequestBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).send('Booking not found.');
        }

        // Update booking status to 'cancelled' without any penalties
        booking.status = 'cancelled';
        await booking.save();

        res.send('Booking cancelled successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
