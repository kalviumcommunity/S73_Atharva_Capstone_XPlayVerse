import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import './Squad.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${BACKEND_URL}`);

const SquadRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [smartReplies, setSmartReplies] = useState([]); 

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`${BACKEND_URL}/api/users/${userId}`, {withCredentials:true})
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/rooms`, {withCredentials:true})
      .then(res => {
        setRooms(res.data);
        if (res.data.length > 0 && !room) {
          setRoom(res.data[0].name);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const fetchSmartReplies = async (text) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/ai/smart-reply`,
        { message: text },
        { withCredentials: true }
      );

      setSmartReplies(res.data);
    } catch (err) {
      console.error("Smart Reply Error:", err);
    }
  };

  useEffect(() => {
    if (!user || !room) return;

    socket.emit('join_room', room);

    const handleReceiveMessage = (data) => {
      if (data.room === room) {
        setMessages(prev => [...prev, data]);

        fetchSmartReplies(data.content);
      }
    };

    const handlePreviousMessages = (msgs) => {
      setMessages(msgs);

      if (msgs.length > 0) {
        fetchSmartReplies(msgs[msgs.length - 1].content);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('previous_messages', handlePreviousMessages);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('previous_messages', handlePreviousMessages);
    };
  }, [user, room]);

  const sendMessage = () => {
    if (!message.trim() || !user || !room) return;

    const newMsg = {
      room,
      content: message,
      author: user.username,
      userId: user?._id,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', newMsg);
    setMessage('');
    setSmartReplies([]);
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/rooms`, { name: newRoomName.trim() }, {withCredentials:true});
      setRooms(prev => [...prev, res.data]);
      setRoom(res.data.name);
      setMessages([]);
      setNewRoomName('');
      setSmartReplies([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating room');
    }
  };

  return (
    <>
      <Navbar />
      <div className="squadroom-container">
        <div className="sidebar">
          <h3 className="sidebar-heading">Chat Rooms</h3>
          <input
            className="room-input"
            type="text"
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button className="room-button" onClick={handleAddRoom}>+ Create Room</button>
          <ul className="room-list">
            {rooms.map(r => (
              <li key={r._id}>
                <button
                  className={`room-name ${r.name === room ? 'active-room' : ''}`}
                  onClick={() => {
                    setRoom(r.name);
                    setMessages([]);
                    setSmartReplies([]);
                  }}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-area">
          <h2 className="room-title">Room: {room || 'None'}</h2>

          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                <div className="chat-author-info">
                  <img
                    src={msg.userId?.profilePicture}
                    alt="profile"
                    className="avatar"
                    onError={(e) => { e.target.src = 'https://avatar.iran.liara.run/public' }}
                  />
                  <strong className="author">@{msg.userId?.username || msg.author}</strong>
                  <span className="timestamp">({msg.time})</span>
                </div>
                <div className="chat-text">{msg.content}</div>
              </div>
            ))}
          </div>

          {smartReplies.length > 0 && (
            <div className="smart-reply-container">
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  className="smart-reply-btn"
                  onClick={() => setMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="message-input-group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="send-button">Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SquadRoom;
