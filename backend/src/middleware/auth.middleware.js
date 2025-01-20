import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token){
            return res.status(401).json({msg: "No Token Provided"})
        }

        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode){
            return res.status(401).json({msg: "Invalid Token"})
        }
        const user = await User.findById(decode.userId).select("-password")
        if (!user){
            return res.status(404).json({msg: "User not found"})
        }

        req.user = user

        next()
    } catch (error) {
        console.log("Error protectRoute Middleware", error.message);
        res.status(500).json({msg: "Internal Server Error"});
    }
}