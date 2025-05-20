import Message from "../models/Message.js";

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('join_room', async (room) => {
      socket.join(room);
      try {
        const messages = await Message.find({ room }).sort({ createdAt: 1 }).populate('userId', 'username profilePicture');
        socket.emit('previous_messages', messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    });
    socket.on('send_message', async (data) => {
      try {
        const newMessage = new Message(data);
        await newMessage.save();
        const populatedMessage = await newMessage.populate('userId', 'username profilePicture');
        io.to(data.room).emit('receive_message', populatedMessage);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
