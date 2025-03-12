import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore"; // Đúng store
import PostCard from "../components/PostCard";
import PostInput from "../components/PostInput";

const NewsFeed = () => {
  const { posts, getPosts, setPosts } = usePostStore(); // Đúng tên hàm

  useEffect(() => {
    getPosts(); // Gọi API lấy bài viết
  }, []);

  // Xử lý đăng bài mới
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]); // Cập nhật danh sách bài viết
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400">
        📢 NewsFeed
      </h1>

      {/* Thanh nhập bài viết */}
      <div className="w-full max-w-3xl">
        <PostInput onPost={handleNewPost} />
      </div>

      {/* Danh sách bài viết */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mt-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
