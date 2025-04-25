import { useState } from "react";
import { Image, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";

const PostInput = () => {
  const { createPost } = usePostStore();
  const [content, setContent] = useState(""); 
  const [images, setImages] = useState([]);
  const { authUser } = useAuthStore();

  const handlePost = () => {
    if (!content.trim() && images.length === 0) return;
    const data ={
      "content": content,
      "images": images
    }
    createPost(data);

    setContent(""); 
    setImages([]); 
  };

  const handleContentChange = (e) => {
    setContent(e.target.value); 
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const base64Images = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      })
    );

    setImages((prevImages) => [...prevImages, ...base64Images]);
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-5 w-full max-w-2xl mb-6 border border-gray-700">

      <div className="flex items-start gap-4">
        <img
          src={authUser?.profilePic || "/default-avatar.png"}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <input
          value={content}
          onChange={handleContentChange} 
          placeholder="Bạn đang nghĩ gì?"
          className="flex-1 focus:outline-none p-4 bg-gray-700 text-white rounded-lg border-b-2 border-gray-600"
          style={{
            minHeight: "50px",
            maxHeight: "50px",
            overflowY: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>


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


      <div className="flex justify-between mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-500 cursor-pointer transition-all"
        >
          <Image className="w-5 h-5" />
          Ảnh
        </label>

        <button
          onClick={handlePost}
          disabled={!content.trim() && images.length === 0}
          className={`px-5 py-2 rounded-lg flex items-center gap-2 transition-all ${
            content.trim() || images.length
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
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
