import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    unique: true, 
    required: true 
    },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
