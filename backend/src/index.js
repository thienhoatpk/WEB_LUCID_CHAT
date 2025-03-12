import multer from 'multer';
import dotenv from "dotenv";
import CookieParser from "cookie-parser"
import cors from "cors"
import express from "express";

import path from "path"

import {connectDB} from "./lib/bd.js";
import {app, server} from "./lib/socket.js"

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRoutes from "./routes/friend.route.js";
import notifyRoutes from "./routes/notify.route.js";
import postRoutes from"./routes/post.route.js";

dotenv.config();
const upload = multer();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 
app.use(upload.none());
app.use(CookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173', // Chỉ cho phép từ frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức được phép
        credentials: true, // Cho phép gửi cookie, nếu cần
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/post", postRoutes)

if(process.env.NODE_ENV){
    app.use(express.static(path.join(__dirname,"../fontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "fontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server is running  on port: " + PORT);
    connectDB();
});