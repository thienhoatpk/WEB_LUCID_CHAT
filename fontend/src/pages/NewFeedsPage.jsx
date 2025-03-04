import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import PostInput from "../components/PostInput";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

  // Giả lập dữ liệu bài viết
  useEffect(() => {
    const fakePosts = [
      {
        id: 1,
        content: "Hello world! Đây là bài post đầu tiên 🎉",
        image: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-1.jpg",
        likesCount: 10,
        comments: [{}, {}, {}],
        createdBy: { name: "Nguyễn Văn A", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-1.jpg" },
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        content: "Lập trình ReactJS cực dễ! 🚀",
        image: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-1.jpg",
        likesCount: 5,
        comments: [{}],
        createdBy: { name: "Trần B", avatar: "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-1.jpg" },
        createdAt: new Date().toISOString(),
      },
    ];

    setPosts(fakePosts);
  }, []);

  // Xử lý đăng bài mới
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
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
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
