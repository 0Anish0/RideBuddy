const FeedbackPost = require('../../models/Community');

exports.CommunityPost = async (req, res) => {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;
    try {
        const feedback = new FeedbackPost({
            user: req.user.id,
            content,
            image
        });
        await feedback.save();
        res.status(201).json({ message: 'Feedback post created successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create feedback post' });
    }
};