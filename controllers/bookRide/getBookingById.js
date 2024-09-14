const BookRide = require('../../models/BookRide');
const Ride = require('../../models/RideOffer');
const Profile = require('../../models/Profile');

const getBookedRideById = async (req, res) => {
    try {
        const bookedRide = await BookRide.findById(req.params.id)
            .populate({
                path: 'ride',
                model: Ride,
            })
            .populate({
                path: 'user',
                model: Profile,
            })
            .exec();

        if (!bookedRide) {
            return res.status(404).json({ message: 'Booked ride not found' });
        }

        res.status(200).json(bookedRide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookedRideById,
};