import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    room: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // referencing to the User, implementing a relationship
        required: true
    },
    content: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
