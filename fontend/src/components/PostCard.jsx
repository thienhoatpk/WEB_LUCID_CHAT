import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-gray-800 text-white shadow-lg rounded-2xl p-4 w-full ">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.createdBy.avatar || "https://via.placeholder.com/40"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{post.createdBy.name}</h3>
          <p className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-200 mb-3">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="rounded-xl w-full object-cover mb-3"
        />
      )}

      <div className="flex items-center justify-between text-gray-400">
        <button onClick={toggleLike} className="flex items-center gap-1">
          <Heart
            className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
          <span>{likeCount}</span>
        </button>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span>{post.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
