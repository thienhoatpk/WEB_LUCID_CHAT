import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
    try {
        const { content, images } = req.body; 
        const imageArray = Array.isArray(images) ? images : [images];
        const newPost = new Post({
            content,
            images: imageArray, 
            createdBy: req.user.id,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};


export const getPosts = async(req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1; // Mặc định trang 1
        limit = parseInt(limit) || 10; // Mặc định 10 bài mỗi lần gọi

        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate("createdBy", "username")
            .sort({ createdAt: -1 }) // Mới nhất trước
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(); // Tổng số bài viết
        res.json({
            page,
            limit,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: "error get post in Post controller", error });
    }
}