import Room from '../models/Rooms.js';

export const GETROOM = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const POSTROOM = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Room name is required' });

  try {
    let room = await Room.findOne({ name });
    if (room) return res.status(400).json({ message: 'Room already exists' });

    room = new Room({ name });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

