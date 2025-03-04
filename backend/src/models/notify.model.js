import mongoose from "mongoose";

const notifySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
        },
        type: {
            type: Number,
        },
    },
    {
        timestamps: true
    }

);
const Notify = mongoose.model("Notify", notifySchema);

export default Notify;