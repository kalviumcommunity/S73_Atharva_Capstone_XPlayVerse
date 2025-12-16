import { useEffect, useState } from "react";
import io from "socket.io-client";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${BACKEND_URL}`);

const SquadRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [smartReplies, setSmartReplies] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/rooms`, { withCredentials: true })
      .then((res) => {
        setRooms(res.data);
        if (res.data.length > 0 && !room) {
          setRoom(res.data[0].name);
        }
      });
  }, []);

  const fetchSmartReplies = async (text) => {
    const res = await axios.post(
      `${BACKEND_URL}/api/ai/smart-reply`,
      { message: text },
      { withCredentials: true }
    );
    setSmartReplies(res.data);
  };

  useEffect(() => {
    if (!user || !room) return;

    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      if (data.room === room) {
        setMessages((prev) => [...prev, data]);
        fetchSmartReplies(data.content);
      }
    });

    socket.on("previous_messages", (msgs) => {
      setMessages(msgs);
      if (msgs.length) fetchSmartReplies(msgs[msgs.length - 1].content);
    });

    return () => {
      socket.off("receive_message");
      socket.off("previous_messages");
    };
  }, [user, room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!user) return;

    socket.emit("send_message", {
      room,
      content: message,
      author: user.username,
      userId: user._id,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
    setSmartReplies([]);
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    const res = await axios.post(
      `${BACKEND_URL}/api/rooms`,
      { name: newRoomName.trim() },
      { withCredentials: true }
    );

    setRooms((prev) => [...prev, res.data]);
    setRoom(res.data.name);
    setMessages([]);
    setNewRoomName("");
    setSmartReplies([]);
  };

  return (
    <>
      <Navbar />

      <Box
        className="container-fluid"
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          marginTop: "64px",
          color: "#e0e0ff",
        }}
      >
        <Box
          sx={{
            width: "280px",
            background: "rgba(20,20,40,0.95)",
            borderRight: "1px solid #3a3a5a",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Chat Rooms
          </Typography>

          <TextField
            size="small"
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            fullWidth
            sx={{
              mb: 1,
              "& input": { color: "#e0e0ff" },
              "& fieldset": { borderColor: "#3a3a5a" },
            }}
          />

          <Button
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddRoom}
            sx={{
              mb: 2,
              background: "linear-gradient(135deg, #6c5ce7 0%, #4a3fcf 100%)",
              color: "white",
            }}
          >
            Create Room
          </Button>

          <Divider sx={{ mb: 2 }} />

          {rooms.map((r) => (
            <Button
              key={r._id}
              fullWidth
              onClick={() => {
                setRoom(r.name);
                setMessages([]);
                setSmartReplies([]);
              }}
              sx={{
                justifyContent: "flex-start",
                mb: 1,
                px: 2,
                py: 1,
                borderRadius: "10px", 
                color: r.name === room ? "#a29bfe" : "#e0e0ff",
                background:
                  r.name === room
                    ? "linear-gradient(135deg, rgba(108,92,231,0.25), rgba(74,63,207,0.25))"
                    : "transparent",
                border:
                  r.name === room
                    ? "1px solid rgba(108,92,231,0.6)"
                    : "1px solid transparent",
                transition: "0.25s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(74,63,207,0.2))",
                  border: "1px solid rgba(108,92,231,0.5)",
                },
              }}
            >
              {r.name}
            </Button>
          ))}
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h6"
            sx={{
              p: 2,
              borderBottom: "1px solid #3a3a5a",
            }}
          >
            Room: {room}
          </Typography>

          <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={
                      msg.userId?.profilePicture ||
                      "https://avatar.iran.liara.run/public"
                    }
                    sx={{ width: 36, height: 36 }}
                  />
                  <Typography fontWeight={600}>
                    @{msg.userId?.username || msg.author}
                  </Typography>
                  <Typography fontSize="0.75rem" color="gray">
                    {msg.time}
                  </Typography>
                </Box>

                <Typography sx={{ ml: 5, mt: 1 }}>{msg.content}</Typography>
              </Box>
            ))}
          </Box>

          {smartReplies.length > 0 && (
            <Box
              sx={{
                p: 2,
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                borderTop: "1px solid #3a3a5a",
                background: "rgba(20,20,40,0.6)",
              }}
            >
              {smartReplies.map((reply, idx) => (
                <Chip
                  key={idx}
                  label={reply}
                  onClick={() => setMessage(reply)}
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    fontSize: "0.9rem",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, rgba(108,92,231,0.25), rgba(74,63,207,0.25))",
                    color: "#e0e0ff",
                    border: "1px solid rgba(108,92,231,0.6)",
                    boxShadow: "0 0 8px rgba(108,92,231,0.4)",
                    cursor: "pointer",
                    transition: "0.25s",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(74,63,207,0.4))",
                      boxShadow: "0 0 12px rgba(108,92,231,0.7)",
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #3a3a5a",
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                "& input": { color: "#e0e0ff" },
                "& fieldset": { borderColor: "#3a3a5a" },
              }}
            />

            <Button
              onClick={sendMessage}
              sx={{
                background: "linear-gradient(135deg, #6c5ce7 0%, #4a3fcf 100%)",
                color: "white",
                px: 3,
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SquadRoom;
