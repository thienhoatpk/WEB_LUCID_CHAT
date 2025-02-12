import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
        },
        fullName: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
            minlenght: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId], 
            ref: "User",
            default: [], 
        },
        requestFriend: {
            type: [mongoose.Schema.Types.ObjectId], 
            ref: "User",
            default: [], 
        },
        invitateFriend: {
            type: [mongoose.Schema.Types.ObjectId], 
            ref: "User",
            default: [], 
        }
    },
    {
        timestamps: true
    }

);
const User = mongoose.model("User", userSchema);

export default User;