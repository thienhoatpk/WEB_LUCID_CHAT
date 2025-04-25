import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore"; // Đúng store
import PostCard from "../components/PostCard";
import PostInput from "../components/PostInput";

const NewsFeed = () => {
  const { posts, getPosts, setPosts } = usePostStore(); // Đúng tên hàm

  useEffect(() => {
    getPosts();
  }, []);


  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400">
        📢 NewsFeed
      </h1>

      <div className="w-full max-w-3xl">
        <PostInput />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-3xl mt-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
