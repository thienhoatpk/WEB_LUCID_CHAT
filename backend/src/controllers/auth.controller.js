import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import { generateToken } from "../lib/ultils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async(req, res) => {
    const {fullName,email, password} = req.body
    try {
        if (password.length < 6 ){
            return res.status(400).json({msg: "Password must be more than 6 character"})
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg: "Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashPassword,
        })
        if (newUser){
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else{
            res.status(400).json({msg: "Invalid data"})
        }     
    } catch (error) {
        console.log("Error in sign up controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
    
};

export const login = async(req, res) => {
    const { email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user)
            return res.status(400).json({msg: "Login is fail"})

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).json({msg: "Login is fail"}) 

        generateToken(user._id,res);
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });

    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
    
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt","", {maxAge:0})
        res.status(200).json({msg: "Logged out Successfully"})

    } catch (error) {
        console.log("Error in sign up controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
    
};

export const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body;
        const useId = req.user._id;
        if (!profilePic){
            return res.status(400).json({msg: "ProfilePic is required"})
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(
            useId, 
            {profilePic: uploadRes.secure_url}, 
            {new:true}
        );
        
        res.status(200).json(updateUser)
    } catch (error) {
        console.log("Error update ProfilePic", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error checkAuth Controller", error.message)
        res.status(500).json({msg: "Internal Server Error"})
    }
}