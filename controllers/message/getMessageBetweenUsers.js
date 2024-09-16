const Message = require('../../models/Message');
const Profile = require('../../models/Profile');
const getMessagesBetweenProfiles = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        // Check if any messages already exist between sender and receiver
        let messages = await Message.find({
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

        // If no messages exist, create a welcome message
        if (messages.length === 0) {
            // Get sender and receiver profiles
            const senderProfile = await Profile.findById(senderId);
            const receiverProfile = await Profile.findById(receiverId);

            if (!senderProfile || !receiverProfile) {
                return res.status(404).json({ message: "Profiles not found" });
            }

            // Create a welcome message
            const welcomeMessage = new Message({
                sender: receiverId, // The receiver sends the welcome message
                receiver: senderId, // The sender receives the welcome message
                message: `Hi ${senderProfile.name}, welcome to connecting with ${receiverProfile.name}!`
            });

            await welcomeMessage.save();

            // Add the welcome message to the messages array
            messages.push(welcomeMessage);
        }

        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controller to get chat profiles based on a given profile ID
const getChatProfiles = async (req, res) => {
    try {
        const { profileId } = req.params;  // Assume profileId is passed as a parameter

        // Find all messages where the given profileId is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: profileId },
                { receiver: profileId }
            ]
        })
        .populate('sender', 'name profilePicture')   // Populating sender's name and profilePicture
        .populate('receiver', 'name profilePicture'); // Populating receiver's name and profilePicture

        // Extract unique chat profiles (focus on receiver's profile)
        let chatProfiles = new Map();  // Use Map to store profiles with additional details

        messages.forEach(msg => {
            // Focus on the receiver's profile if they are not the current user
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

                // Increment unread messages count if the message is not read and the receiver is the current user
                if (!msg.isRead && msg.sender._id.toString() === profileId) {
                    chatProfiles.get(msg.receiver._id.toString()).unreadMessages += 1;
                }

                // Update lastMessageTime if this message is more recent
                if (msg.timestamp > chatProfiles.get(msg.receiver._id.toString()).lastMessageTime) {
                    chatProfiles.get(msg.receiver._id.toString()).lastMessageTime = msg.timestamp;
                }
            }

            // Optionally, you can also handle the sender's profile here, but skip this part if focusing only on receivers
        });

        // Convert Map to array
        const chatProfilesArray = Array.from(chatProfiles.values());

        res.status(200).json({
            success: true,
            chatProfiles: chatProfilesArray,
            message: 'Chat profiles (receiver-focused) fetched successfully'
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