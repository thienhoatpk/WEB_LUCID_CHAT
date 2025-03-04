import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    image: { type: String, default: '' },
    likesCount: { type: Number, default: 0 },
    likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Liên kết với Comment
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
