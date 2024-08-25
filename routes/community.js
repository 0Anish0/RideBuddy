const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');
const authenticateToken = require('../middleware/authenticateToken');
const { CommunityPost } = require('../controllers/community/postInCommunity.js');
const { likePost } = require('../controllers/community/likeCommunityPost.js');
const { getCommunityPosts } = require('../controllers/community/getAllCommunityPosts.js');

router.post('/community-post', authenticateToken, upload.fields([
    { name: 'feedbackPicture', maxCount: 1 },
]), CommunityPost);

router.post('/like-post/:id', authenticateToken, likePost);
router.post('/all-posts', authenticateToken, getCommunityPosts);

module.exports = router;