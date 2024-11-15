import express from "express";
import { getComments, addComment } from "../controller/comments.js";

const router = express.Router();

router.get("/comments", getComments);
router.post("/addComment", addComment);

export default router;
