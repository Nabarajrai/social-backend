import express from "express";
import { getLikes, deleteLikes, addLikes } from "../controller/likes.js";

const router = express.Router();

router.get("/likes", getLikes);
router.delete("/deleteLikes", deleteLikes);
router.post("/addLikes", addLikes);

export default router;
