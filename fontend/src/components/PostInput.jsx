import { useState, useRef } from "react";
import { Image, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const PostInput = ({ onPost }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // Dùng mảng để lưu nhiều ảnh
  const inputRef = useRef(null);
  const { authUser } = useAuthStore();

  const handlePost = () => {
    if (!content.trim()) return;

    onPost({
      id: Date.now(),
      content,
      images,
      likesCount: 0,
      comments: [],
      createdBy: { name: authUser.fullName, avatar: authUser.profilePic },
      createdAt: new Date().toISOString(),
    });

    setContent("");
    setImages([]);
    if (inputRef.current) {
      inputRef.current.innerText = ""; // Xóa nội dung nhập
    }
  };

  const handleChange = (e) => {
    setContent(e.target.innerText);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]); // Thêm ảnh vào danh sách
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-5 w-full max-w-2xl mb-6 border border-gray-700">
      {/* Avatar + Ô nhập */}
      <div className="flex items-start gap-4">
        <img
          src={authUser?.profilePic || "/default-avatar.png"}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div
          ref={inputRef}
          contentEditable
          onInput={handleChange}
          placeholder="Bạn đang nghĩ gì?"
          className="flex-1 focus:outline-none p-4 bg-gray-700 text-white rounded-lg border-b-2 border-gray-600"
          style={{
            minHeight: "60px",
            maxHeight: "250px",
            overflowY: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>

      {/* Hiển thị ảnh (nếu có) */}
      {images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt="Preview"
                className="rounded-lg max-h-24 object-cover w-24 shadow-sm"
              />
              <button
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute -top-2 right-1 bg-transparent border-none text-white text-3xl"
                style={{ cursor: "pointer", borderRadius: "50%" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chức năng thêm ảnh + Đăng bài */}
      <div className="flex justify-between mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="flex items-center gap-2 text-blue-400 hover:text-blue-500 cursor-pointer transition-all">
          <Image className="w-5 h-5" />
          Ảnh
        </label>

        <button
          onClick={handlePost}
          disabled={!content.trim()}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${
            content.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
          Đăng
        </button>
      </div>
    </div>
  );
};

export default PostInput;
