const Ride = require('../../models/RideOffer');
const geolib = require('geolib');

const getAllRides = async (req, res) => {
    console.log('getAllRides controller called', req.body);
    try {
        const { pickupDate, sourcePoint, destinationPoint } = req.body;

        let rides = await Ride.find({});
        console.log(rides);

        if (pickupDate) {
            rides = rides.filter(ride =>
                new Date(ride.pickupDate).toISOString().split('T')[0] === new Date(pickupDate).toISOString().split('T')[0]
            );
        }

        // Filter by source point within 20 km radius
        if (sourcePoint) {
            rides = rides.filter(ride => {
                const distance = geolib.getDistance(
                    {
                        latitude: parseFloat(ride.sourcePoint.latitude),
                        longitude: parseFloat(ride.sourcePoint.longitude)
                    },
                    {
                        latitude: parseFloat(sourcePoint.latitude),
                        longitude: parseFloat(sourcePoint.longitude)
                    }
                );
                return distance <= 20000;
            });
        }

        // Filter by destination point within 20 km radius
        if (destinationPoint) {
            rides = rides.filter(ride => {
                const distance = geolib.getDistance(
                    {
                        latitude: parseFloat(ride.destinationPoint.latitude),
                        longitude: parseFloat(ride.destinationPoint.longitude)
                    },
                    {
                        latitude: parseFloat(destinationPoint.latitude),
                        longitude: parseFloat(destinationPoint.longitude)
                    }
                );
                return distance <= 20000;
            });
        }

        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve rides', error: error.message });
    }
};

module.exports = { getAllRides };