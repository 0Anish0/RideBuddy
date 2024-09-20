const Message = require('../../models/Message');
const Profile = require('../../models/Profile');
const AadharVerification = require('../../models/AdharVerification');

const getMessagesBetweenProfiles = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        let messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
            .sort('timestamp')
            // .populate({
            //     path: 'receiver',
            //     select: 'name profilePicture aadharVerification',
            //     populate: {
            //         path: 'aadharVerification',
            //         select: 'response.image'
            //     }
            // })
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
                select: 'name profilePicture aadharVerification',
                populate: {
                    path: 'userId aadharVerification',
                    select: 'mobile response.image'
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
                message: `Hi ${ senderProfile.name }, welcome to connecting with ${ receiverProfile.name } !`
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
        const { profileId } = req.params;

        // Find all messages where the given profileId is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { sender: profileId },
                { receiver: profileId }
            ]
        })
            .populate('sender', 'name profilePicture')
            .populate({
                path: 'receiver',
                select: 'name profilePicture aadharVerification',
                populate: {
                    path: 'aadharVerification',
                    select: 'response.image' // Get the Aadhar image from the response
                }
            });

        // Extract unique chat profiles
        let chatProfiles = new Map();

        messages.forEach(msg => {
            // Focus on the receiver's profile if they are not the current user
            if (msg.receiver._id.toString() !== profileId) {
                if (!chatProfiles.has(msg.receiver._id.toString())) {
                    chatProfiles.set(msg.receiver._id.toString(), {
                        _id: msg.receiver._id,
                        name: msg.receiver.name,
                        profilePicture: msg.receiver.profilePicture,
                        aadharVerification: msg.receiver.aadharVerification ? {
                            image: msg.receiver.aadharVerification.response.image || null, // Get Aadhar image
                            verificationStatus: msg.receiver.aadharVerification.status || null // Include verification status
                        } : null,
                        unreadMessages: 0,
                        lastMessageTime: msg.timestamp
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
            chatProfiles: chatProfilesArray.map(profile => ({
                _id: profile._id,
                name: profile.name,
                profilePicture: profile.profilePicture,
                aadharVerification: profile.aadharVerification ? {
                    image: profile.aadharVerification.image || null,
                } : null,
                unreadMessages: profile.unreadMessages,
                lastMessageTime: profile.lastMessageTime
            })),
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

module.exports = { getMessagesBetweenProfiles, getChatProfiles };