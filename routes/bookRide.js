const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Import individual controllers
const { createBooking } = require('../controllers/bookRide/createBooking');
const { getAllRides } = require('../controllers/bookRide/getAllBookings');
const { getBookingById } = require('../controllers/bookRide/getBookingById');
const { updateBooking } = require('../controllers/bookRide/updateBooking');
const { cancelBooking } = require('../controllers/bookRide/cancleBooking');

// Define routes for Book Ride functionality
router.post('/book-ride', authenticateToken, createBooking); // Create a new ride booking
router.get('/bookings', authenticateToken, getAllRides);  // Get all ride bookings(Rides)
router.get('/booking/:id', authenticateToken, getBookingById);  // Specific ride booking by ID
router.put('/booking/:id', authenticateToken, updateBooking);  // Update a ride booking by ID
router.delete('/booking/:id', authenticateToken, cancelBooking);  // Cancel a ride booking by ID

module.exports = router; 