const Vehicle = require('../../models/Vehicle');
const Ride = require('../../models/RideOffer');

exports.createRide = async (req, res) => {
    try {
        const driver = req.user.id;
        const { sourceName, sourcePoint, addStopName, addStopPoints, destinationName, destinationPoint, routes, tripDistance, tripDuration, pickupTime, pickupDate, noOfSeat, pricePerSeat } = req.body;

        // all fields are required without addStop
        if (!sourceName || !sourcePoint || !destinationName || !destinationPoint || !routes || !tripDistance || !tripDuration || !pickupTime || !pickupDate || !noOfSeat || !pricePerSeat) {
            return res.status(400).json({ message: "Please fill all the required fields" });
        }

        const vehicles = await Vehicle.find({ driver });
        if (vehicles.length === 0) {
            return res.status(400).json({ message: 'No vehicle found for the user' });
        }
        const vehicle = vehicles[0];
        const vehical = vehicle.id;

        const newRide = new Ride({
            driver,
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoints,
            destinationName,
            destinationPoint,
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