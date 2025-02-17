import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // Stores userId -> socket.id mappings
const notifications = {}; // Stores userId -> notifications array

export function getReceiverId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🔗 New connection:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    if (userSocketMap[userId]) {
      console.log(`🔄 Replacing old socket for user: ${userId}`);
    }
    userSocketMap[userId] = socket.id;

    // Send stored notifications to the user on reconnect
    if (notifications[userId]) {
      notifications[userId].forEach((notif) => {
        io.to(socket.id).emit("receiveNotification", notif);
      });
      notifications[userId] = []; // Clear after sending
    }
  }

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle sending a notification
  socket.on("sendNotification", ({ receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];

    const notification = {
      message,
      time: new Date().toLocaleTimeString(),
    };

    if (receiverSocketId) {
      // Send notification in real-time if the user is online
      io.to(receiverSocketId).emit("receiveNotification", notification);
    } else {
      // Store notification for later if the user is offline
      if (!notifications[receiverId]) {
        notifications[receiverId] = [];
      }
      notifications[receiverId].push(notification);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
