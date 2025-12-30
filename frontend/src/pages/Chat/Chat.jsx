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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import VerifiedIcon from "@mui/icons-material/Verified";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${BACKEND_URL}`, { withCredentials: true });

const Chat = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /* 🔹 Fetch current user */
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/me`, { withCredentials: true })
      .then(res => setUser(res.data.user));
  }, []);

  /* 🔹 Fetch all users */
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/users`, { withCredentials: true })
      .then(res => setUsers(res.data));
  }, []);

  /* 🔹 Join private room */
  useEffect(() => {
    if (!user || !selectedUser) return;

    const rid = [user._id, selectedUser._id].sort().join("_");
    setRoomId(rid);
    setMessages([]);

    socket.emit("join_private_chat", { roomId: rid });

    socket.on("previous_private_messages", msgs => {
      setMessages(msgs);
    });

    socket.on("receive_private_message", msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receive_private_message");
      socket.off("previous_private_messages");
    };
  }, [user, selectedUser]);

  /* 🔹 Send message */
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("send_private_message", {
      roomId,
      senderId: user._id,
      receiverId: selectedUser._id,
      content: message,
    });

    setMessage("");
  };

  /* 🔹 Filtered users based on search */
  const filteredUsers = users.filter(
    u =>
      u._id !== user?._id &&
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          mt: "64px",
          color: "white",
        }}
      >
        {/* LEFT SIDEBAR */}
        <Box sx={{ width: 280, p: 2, borderRight: "1px solid #3a3a5a" }}>
          <Typography variant="h6" mb={1} color="white">
            Direct Messages
          </Typography>

          {/* 🔍 SEARCH */}
          <TextField
            size="small"
            placeholder="Search user..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              "& input": { color: "white" },
              "& fieldset": { borderColor: "#3a3a5a" },
              "& input::placeholder": {
                color: "rgba(255,255,255,0.6)",
              },
            }}
          />

          <Divider sx={{ mb: 2, borderColor: "#3a3a5a" }} />

          {filteredUsers.length === 0 ? (
            <Typography
              sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}
            >
              No users found
            </Typography>
          ) : (
            filteredUsers.map(u => (
              <Button
                key={u._id}
                fullWidth
                onClick={() => setSelectedUser(u)}
                sx={{
                  justifyContent: "flex-start",
                  mb: 1,
                  color: "white",
                  textTransform: "none",
                  background:
                    selectedUser?._id === u._id
                      ? "rgba(108,92,231,0.25)"
                      : "transparent",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "rgba(108,92,231,0.2)",
                  },
                }}
              >
                <Avatar
                  src={u.profilePicture}
                  sx={{ mr: 1, width: 30, height: 30 }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Typography>@{u.username}</Typography>
                  {u.isVerified && (
                    <VerifiedIcon
                      sx={{ fontSize: "16px", color: "#1DA1F2" }}
                    />
                  )}
                </Box>
              </Button>
            ))
          )}
        </Box>

        {/* CHAT WINDOW */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {!selectedUser ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 1.5,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Typography variant="h5" color="white">
                No chat selected
              </Typography>
              <Typography>
                Please search and select a user to start chatting
              </Typography>
            </Box>
          ) : (
            <>
              {/* CHAT HEADER */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #3a3a5a",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Typography color="white">
                  Chat with @{selectedUser.username}
                </Typography>
                {selectedUser.isVerified && (
                  <VerifiedIcon
                    sx={{ fontSize: "18px", color: "#1DA1F2" }}
                  />
                )}
              </Box>

              {/* MESSAGES */}
              <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
                {messages.map((msg, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Typography fontWeight={600} color="white">
                        @{msg.sender.username}
                      </Typography>
                      {msg.sender.isVerified && (
                        <VerifiedIcon
                          sx={{ fontSize: "14px", color: "#1DA1F2" }}
                        />
                      )}
                    </Box>

                    <Typography color="white">{msg.content}</Typography>
                  </Box>
                ))}
              </Box>

              {/* INPUT */}
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
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  InputProps={{ sx: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#3a3a5a" },
                      "&:hover fieldset": { borderColor: "#6c5ce7" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6c5ce7",
                      },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.6)",
                    },
                  }}
                />

                <Button
                  onClick={sendMessage}
                  sx={{
                    color: "white",
                    background:
                      "linear-gradient(135deg, #6c5ce7, #4a3fcf)",
                    px: 3,
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chat;
