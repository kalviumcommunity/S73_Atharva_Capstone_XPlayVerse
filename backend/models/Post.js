import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    caption: { 
        type: String 
    },
    image: { 
        type: String 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post;