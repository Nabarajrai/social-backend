import express from "express";
import { posts, addPost, userPosts, deletePosts } from "../controller/posts.js";

const router = express.Router();

router.get("/posts", posts);
router.post("/addPost", addPost);
router.get("/userPosts/:id", userPosts);
router.delete("/deletePosts/:id", deletePosts);

export default router;
