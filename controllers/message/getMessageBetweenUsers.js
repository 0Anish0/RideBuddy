const Message = require('../../models/Message');
const Profile = require('../../models/Profile');
const getMessagesBetweenProfiles = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
        .sort('timestamp')
        .populate({
            path: 'sender',
            select: 'name profilePicture',
            populate: {
                path: 'userId',
                select: 'mobile'
            }
        })
        .populate({
            path: 'receiver',
            select: 'name profilePicture',
            populate: {
                path: 'userId',
                select: 'mobile'
            }
        });

        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controller to get chat profiles based on a given profile ID
const getChatProfiles = async (req, res) => {
    try {
        const { profileId } = req.params;  // Assume profileId is passed as a parameter

        // Fetch the profile details of the current user
        const currentUser = await Profile.findById(profileId).select('name profilePicture');
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        // Find all messages where the given profileId is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: profileId },
                { receiver: profileId }
            ]
        })
        .populate('sender', 'name profilePicture')   // Populating sender's name and profilePicture
        .populate('receiver', 'name profilePicture'); // Populating receiver's name and profilePicture

        // If no messages are found, return default profile with welcome message
        if (messages.length === 0) {
            return res.status(200).json({
                success: true,
                chatProfiles: [
                    {
                        _id: currentUser._id,
                        name: currentUser.name,
                        profilePicture: currentUser.profilePicture,
                        welcomeMessage: `Welcome, ${currentUser.name}! Start a new conversation.`
                    }
                ],
                message: 'No chat messages found, displaying user profile'
            });
        }

        // Extract unique chat profiles (both senders and receivers)
        let chatProfiles = new Map();  // Use Map to store profiles with additional details

        messages.forEach(msg => {
            // Check for the sender, skip if it's the current user
            if (msg.sender._id.toString() !== profileId) {
                if (!chatProfiles.has(msg.sender._id.toString())) {
                    chatProfiles.set(msg.sender._id.toString(), {
                        _id: msg.sender._id,
                        name: msg.sender.name,
                        profilePicture: msg.sender.profilePicture,
                        unreadMessages: 0,
                        lastMessageTime: msg.timestamp  // Initialize with the message's timestamp
                    });
                }
                // Increment unread messages count if the message is not read and the receiver is the current user
                if (!msg.isRead && msg.receiver._id.toString() === profileId) {
                    chatProfiles.get(msg.sender._id.toString()).unreadMessages += 1;
                }
                // Update lastMessageTime if this message is more recent
                if (msg.timestamp > chatProfiles.get(msg.sender._id.toString()).lastMessageTime) {
                    chatProfiles.get(msg.sender._id.toString()).lastMessageTime = msg.timestamp;
                }
            }

            // Check for the receiver, skip if it's the current user
            if (msg.receiver._id.toString() !== profileId) {
                if (!chatProfiles.has(msg.receiver._id.toString())) {
                    chatProfiles.set(msg.receiver._id.toString(), {
                        _id: msg.receiver._id,
                        name: msg.receiver.name,
                        profilePicture: msg.receiver.profilePicture,
                        unreadMessages: 0,
                        lastMessageTime: msg.timestamp  // Initialize with the message's timestamp
                    });
                }
                // Increment unread messages count if the message is not read and the sender is the current user
                if (!msg.isRead && msg.sender._id.toString() === profileId) {
                    chatProfiles.get(msg.receiver._id.toString()).unreadMessages += 1;
                }
                // Update lastMessageTime if this message is more recent
                if (msg.timestamp > chatProfiles.get(msg.receiver._id.toString()).lastMessageTime) {
                    chatProfiles.get(msg.receiver._id.toString()).lastMessageTime = msg.timestamp;
                }
            }
        });

        // Convert Map to array
        const chatProfilesArray = Array.from(chatProfiles.values());

        res.status(200).json({
            success: true,
            chatProfiles: chatProfilesArray,
            message: 'Chat profiles fetched successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching chat profiles',
            error: error.message
        });
    }
};


module.exports = {getMessagesBetweenProfiles, getChatProfiles};