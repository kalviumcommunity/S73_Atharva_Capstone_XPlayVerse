import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
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
    },
    profilePicture: {
        type: String,
        default: '',
    },
})

const User = mongoose.model("User", userSchema);

export default User;