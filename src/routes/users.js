import express from "express";
import { getUser, getSuggestions } from "../controller/users.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/suggestions", getSuggestions);

export default router;
