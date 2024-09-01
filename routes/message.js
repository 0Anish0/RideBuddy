const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Import individual controllers
const { sendMessage } = require('../controllers/message/sendmessage')
const { getMessageById } = require('../controllers/message/getmessage');

// Define routes for message functionality
router.post('/messages', authenticateToken, sendMessage); // Route to POST messages
router.get('/getmessages/:id', authenticateToken, getMessageById); // Route to GET messages

module.exports = router;