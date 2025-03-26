import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    games:{
        type: [String],
        default: []
    },
    achievements: { 
        type: [String], 
        default: [] 
    },
    highScore: { 
        type: Number, 
        default: 0 
    }
})

const User = mongoose.model("User", userSchema);

export default User;