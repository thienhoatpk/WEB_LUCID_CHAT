import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

const userSocketMap = {}; 
const notifications = {}; 

export function getReceiverId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  // console.log("🔗 New connection:", socket.id);
  
  const userId = socket.handshake.query.userId;
  // console.log("idUSER "+userId)
  if (userId) {
    if (userSocketMap[userId]) {
      console.log(`🔄 Replacing old socket for user: ${userId}`);
    }
    userSocketMap[userId] = socket.id;
   
   
    // console.log(userSocketMap)

   
  }
 
  

  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, server, io };
