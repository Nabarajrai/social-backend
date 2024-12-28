import express from "express";
import {
  getUser,
  getSuggestions,
  updateUserDetails,
} from "../controller/users.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/suggestions", getSuggestions);
router.put("/updateUserDetails", updateUserDetails);

export default router;
