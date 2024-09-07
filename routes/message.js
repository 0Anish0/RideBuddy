const express = require('express');

// Import individual controllers
const sendMessage = require('../controllers/message/sendMessage'); //corrected
const getMessagesBetweenProfiles = require('../controllers/message/getMessageBetweenUsers');
const markMessageAsRead = require('../controllers/message/markMessageAsRead');

const router = express.Router();

// Define routes for message functionality
router.get('/messages/:senderId/:receiverId', getMessagesBetweenProfiles);  // Get messages between two profiles
router.post('/messages', sendMessage);  // Send a message
router.patch('/read/:messageId', markMessageAsRead);  // Mark a message as read

module.exports = router;