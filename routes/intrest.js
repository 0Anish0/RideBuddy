const express = require('express');
const router = express.Router();
const { getAllInterests } = require('../controllers/getIntrest');

// Route to get all Interest
router.get('/get-intrest', getAllInterests);

module.exports = router;