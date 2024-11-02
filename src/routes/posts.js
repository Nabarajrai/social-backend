import express from "express";
import { posts, addPost } from "../controller/posts.js";

const router = express.Router();

router.get("/posts", posts);
router.post("/addPost", addPost);

export default router;
