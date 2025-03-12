import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    images: [{ type: String, default: [] }], // Chuyển từ image (String) thành images (Array)
    likesCount: { type: Number, default: 0 },
    likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
