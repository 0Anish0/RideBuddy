const express = require('express');
const router = express.Router();


// Import individual controllers
const { createBooking } = require('../controllers/bookRide/createBooking');
const { getAllRides } = require('../controllers/bookRide/getAllBookings');
const { getBookingById } = require('../controllers/bookRide/getBookingById');
const { updateBooking } = require('../controllers/bookRide/updateBooking');
const { cancelBooking } = require('../controllers/bookRide/cancleBooking');

// Define routes for Book Ride functionality
router.post('/book-ride', createBooking); // Create a new ride booking
router.post('/getAllRides', getAllRides);
router.get('/booking/:id', getBookingById);  // Specific ride booking by ID
router.put('/booking/:id', updateBooking);  // Update a ride booking by ID
router.delete('/booking/:id', cancelBooking);  // Cancel a ride booking by ID

module.exports = router;