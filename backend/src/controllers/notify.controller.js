import User from "../models/user.model.js";
import Notify from "../models/notify.model.js"
import { getReceiverId, io } from "../lib/socket.js";

    
export const sendNotification = async(req, res) => {
    try {
        const data = req.body
        const receiverSocketId = getReceiverId(data.receiverId);
        const newNotify = new Notify({
            userId : data.receiverId,
            content : data.message,
            type : data.type,
        })
        if(receiverSocketId){
          console.log(receiverSocketId)
          io.to(receiverSocketId).emit("notification", newNotify);
        }
        res.status(200).json({msg: "successfull"})
    } catch (error) {
        console.log("Error in Notify controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
}