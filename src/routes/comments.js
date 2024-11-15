import express from "express";
import { getComments } from "../controller/comments.js";

const router = express.Router();

router.get("/comments", getComments);

export default router;
