const Profile = require('../../models/Profile');

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { bio, interests, prompts, location } = req.body;

    try {
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if (req.files && req.files.profilePicture) {
            const profilePictureFile = req.files.profilePicture[0];
            const profilePicture = {
                fileName: profilePictureFile.filename,
                filePath: profilePictureFile.path,
                url: `${req.protocol}://${req.get('host')}/uploads/profilepicture/${profilePictureFile.filename}`
            };
            profile.profilePicture = profilePicture;
        }
        if (req.files && req.files.images) {
            const newImages = req.files.images.map(file => ({
                fileName: file.filename,
                filePath: file.path,
                url: `${req.protocol}://${req.get('host')}/uploads/userimages/${file.filename}`
            }));
            if (profile.images.length + newImages.length > 5) {
                return res.status(400).json({ message: 'Cannot upload more than 5 images' });
            }

            profile.images = [...profile.images, ...newImages];
        }
        if (interests) {
            profile.interests = interests;
        }
        if (bio) {
            profile.bio = bio;
        }
        if (prompts) {
            profile.prompts = prompts;
        }
        if (location) {
            profile.location = location;
        }

        await profile.save();
        return res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

module.exports = {
    updateProfile
};