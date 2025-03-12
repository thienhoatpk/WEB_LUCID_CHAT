import express from 'express';
import {createPost, getPosts} from "../controllers/post.controller.js"
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post("/create-post", protectRoute, createPost);

router.get("/get-post", protectRoute, getPosts);
// router.post("/remove-post", protectRoute, removePost);

// router.post("/like-post", protectRoute, likePost);

// router.post("/comment-post", protectRoute, commentPost);
// 1
// router.get("/get-comment", protectRoute, getComments);

// router.get("/get-like", protectRoute, getLikes);



export default router;