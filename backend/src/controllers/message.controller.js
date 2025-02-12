import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverId, io } from "../lib/socket.js";
import { protectRoute } from '../middleware/auth.middleware.js';


export const getUserForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error getUserForSidebar", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
}

export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
        
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imgUrl;
        if (image){
            const uploadRes =  await cloudinary.uploader.upload(image);
            imgUrl = uploadRes.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imgUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverId(receiverId);
        if(receiverSocketId){
          console.log(receiverSocketId)
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sendMessage controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
}