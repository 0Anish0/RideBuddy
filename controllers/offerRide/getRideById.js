const Ride = require('../../models/RideOffer');

exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id).populate('vehical');
        if (!ride) {
            return res.status(404).json({ success: false, message: 'Ride not found' });
        }
        res.status(200).json({ success: true, ride });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch ride', error: error.message });
    }
};