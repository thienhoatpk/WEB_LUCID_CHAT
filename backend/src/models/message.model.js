// models/message.model.js (cập nhật)
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Có thể là null nếu tin nhắn được gửi vào nhóm
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Có thể là null nếu tin nhắn riêng tư
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatGroup" },
  text: { type: String },
  image: { type: String },
  isRevoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Đảm bảo tin nhắn phải thuộc về một cuộc trò chuyện riêng tư hoặc một nhóm
messageSchema.pre('save', function(next) {
  if (!this.receiverId && !this.groupId) {
    return next(new Error('Message must have either receiverId or groupId'));
  }
  if (this.receiverId && this.groupId) {
    return next(new Error('Message cannot have both receiverId and groupId'));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;