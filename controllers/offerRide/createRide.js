const Vehicle = require('../../models/Vehicle');
const Ride = require('../../models/RideOffer');
const Profile = require('../../models/Profile');

exports.createRide = async (req, res) => {
    try {
        const driver = Profile.findOne(req.user.id);
        const { sourceName, sourcePoint, addStopName, addStopPoints, destinationName, destinationPoint, routes, tripDistance, tripDuration, pickupTime, pickupDate, noOfSeat, pricePerSeat } = req.body;

        if (!sourceName || !sourcePoint || !destinationName || !destinationPoint || !routes || !tripDistance || !tripDuration || !pickupTime || !pickupDate || !noOfSeat || !pricePerSeat) {
            return res.status(400).json({ message: "Please fill all the required fields" });
        }

        const vehicles = await Vehicle.find(driver.id);
        if (vehicles.length === 0) {
            return res.status(400).json({ message: 'No vehicle found for the user' });
        }
        const vehicle = vehicles[0];
        const vehical = vehicle.id;

        const newRide = new Ride({
            sourceName,
            sourcePoint,
            addStopName,
            addStopPoints,
            destinationName,
            destinationPoint,
            routes,
            vehical,
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