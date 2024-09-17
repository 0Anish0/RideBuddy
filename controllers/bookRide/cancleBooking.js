const Profile = require('../../models/Profile');
const Wallet = require('../../models/Wallet');
const RideOffer = require('../../models/RideOffer');
const ConfirmedRide = require('../../models/ConfirmedRide');
const RequestBooking = require('../../models/RequestBooking');

exports.cancelConfirmedRide = async (req, res) => {
    const { confirmedRideId } = req.params;
    const { userId } = "66cfe8f83202b86bd8256af2";
    try {
        const confirmedRide = await ConfirmedRide.findById(confirmedRideId).passengers.populate("bookRideId");
        if (!confirmedRide) {
            return res.status(404).send('Confirmed ride not found.');
        }
        const rideOffer = await RideOffer.findById(confirmedRide.offeredRideId);
        if (!rideOffer) {
            return res.status(404).send('Ride offer not found.');
        }
        const timeDiff = new Date(rideOffer.pickupTime) - new Date();
        if (timeDiff < 900000) {
            return res.status(400).send('Cancellation must be made at least 15 minutes before pickup time.');
        }

        const totalCost = confirmedRide.passengers.bookRideId.paymentAmount;
        console.log(totalCost)
        const penalty = totalCost * 0.15;
        const refund = totalCost - penalty;
        const driverShare = totalCost * 0.10;
        const adminShare = totalCost * 0.05;

        const userProfile = await Profile.findOne({ userId }).populate('wallet');
        const driverProfile = await Profile.findById(rideOffer.driver).populate('wallet');
        if (!userProfile || !userProfile.wallet || !driverProfile || !driverProfile.wallet) {
            return res.status(404).send('Profile or Wallet not found.');
        }
        const userWallet = await Wallet.findById(userProfile.wallet._id);
        const driverWallet = await Wallet.findById(driverProfile.wallet._id);
        if (!userWallet || !driverWallet) {
            return res.status(404).send('Wallets not found.');
        }

        userWallet.balance += refund;
        driverWallet.balance += driverShare;
        await userWallet.save();
        await driverWallet.save();

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

exports.cancelRequestBooking = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const booking = await RequestBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).send('Booking not found.');
        }
        booking.status = 'cancelled';
        await booking.save();
        res.send('Booking cancelled successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};