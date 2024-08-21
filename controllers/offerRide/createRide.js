const Vehicle = require('../../models/Vehicle');
const Ride = require('../../models/RideOffer');

exports.createRide = async (req, res) => {
    try {
        const { source, addStop, destination, routes, tripDistance, tripDuration, pickupTime, pickupDate, noOfSeat, pricePerSeat } = req.body;

        const ownerId = req.user.id;

        const vehicles = await Vehicle.find({ ownerId });
        if (vehicles.length === 0) {
            return res.status(400).json({ message: 'No vehicle found for the user' });
        }

        const vehicle = vehicles[0];
        const vehical = vehicle.id;

        const newRide = new Ride({
            source,
            addStop,
            destination,
            vehical,
            routes,
            tripDistance,
            tripDuration,
            pickupTime,
            pickupDate,
            noOfSeat,
            pricePerSeat
        });

        await newRide.save();
        res.status(201).json({ success: true, message: 'Ride created successfully', ride: newRide });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create ride', error: error.message });
    }
};